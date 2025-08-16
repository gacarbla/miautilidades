import MiauSlashSubcommandBuilder from "./slashSubcommandBuilder";
import client from "../../../..";
import { interactionNameRegEx } from "../../../constants/discord";

class MiauSlashSubcommandgroupBuilder<
    TSubs extends Record<string, MiauSlashSubcommandBuilder> = {}
> {
    constructor(init?: {
        subcommands?: TSubs;
        name?: string;
        description?: string;
    }) {
        if (init?.subcommands) this.subcommands = init.subcommands;
        if (init?.name) this.name = init.name;
        if (init?.description) this.description = init.description;
    }

    private console = client.utils.console;

    private subcommands: TSubs = {} as TSubs;
    name: string | undefined = undefined;
    description: string | undefined = undefined;

    setName(name: string): this {
        if (name.length < 1 || name.length > 32) {
            this.console.error(["error", "commandBuildError"], "Tamaño incorrecto en el nombre. Debe ser de 1 a 32 caracteres.");
            throw new Error("El nombre debe tener entre 1 y 32 caracteres.");
        }
        if (name !== name.toLowerCase()) {
            this.console.warning(["commandBuildError"], "Los comandos slash no aceptan mayúsculas en su nombre.");
        }
        if (!interactionNameRegEx.test(name)) {
            this.console.error(["error", "commandBuildError"], "El nombre contiene caracteres inválidos.");
            throw new Error("El nombre contiene caracteres inválidos.");
        }
        this.name = name;
        return this;
    }

    setDescription(description: string): this {
        if (description.length < 1) {
            this.console.error(["error", "commandBuildError"], "La descripción debe tener al menos un carácter.");
            throw new Error("La descripción debe tener al menos un carácter.");
        }
        if (description.length > 100) {
            this.console.warning(["commandBuildError"], "La descripción no puede exceder los 100 caracteres.");
            description = description.substring(0, 100);
        }
        this.description = description;
        return this;
    }

    addSubcommand(
        s: (subcommand: MiauSlashSubcommandBuilder) => MiauSlashSubcommandBuilder
    ): this {
        const sub = s(new MiauSlashSubcommandBuilder());

        if (!sub.test()) throw new Error("El subcomando parece estar mal declarado.");
        if (!sub.name) throw new Error("El subcomando debe tener nombre antes de añadirse.");
        const key = sub.name;

        const count = Object.keys(this.subcommands).length;
        if (count >= 25) throw new Error("Este grupo ya tiene 25 subcomandos.");
        if (this.subcommands[key as keyof TSubs]) {
            this.console.error(["error", "commandBuildError"], `Subcomando duplicado: '${key}'.`);
            throw new Error(`Ya existe un subcomando con nombre '${key}'.`);
        }

        (this.subcommands as Record<string, MiauSlashSubcommandBuilder>)[key] = sub;
        return this;
    }

    getSubcommands(): TSubs {
        return this.subcommands;
    }

    getSubcommandsArray(): MiauSlashSubcommandBuilder[] {
        return Object.values(this.subcommands);
    }

    test(): boolean {
        const nameOk =
            typeof this.name === "string" &&
            interactionNameRegEx.test(this.name) &&
            this.name.length >= 1 &&
            this.name.length <= 32;

        const descOk =
            typeof this.description === "string" &&
            this.description.length >= 1 &&
            this.description.length <= 100;

        const arr = this.getSubcommandsArray();

        const allSubsValid = arr.every((sub) => sub.test());
        const countOk = arr.length >= 1 && arr.length <= 25;

        const noDup = new Set(arr.map(s => s.name)).size === arr.length;

        return nameOk && descOk && allSubsValid && countOk && noDup;
    }

    toJSON() {
        if (!this.test()) {
            this.console.error(["error", "commandBuildError"], "El grupo de subcomandos no es válido.");
            throw new Error("El grupo de subcomandos no es válido.");
        }

        return {
            name: this.name!.toLowerCase(),
            description: this.description!,
            type: 2,
            options: this.getSubcommandsArray().map((s) => s.toJSON())
        };
    }

    exportHelp(): {
        name: string;
        description: string;
        subcommands: ReturnType<MiauSlashSubcommandBuilder["exportHelp"]>[];
    } {
        return {
            name: this.name ?? "desconocido",
            description: this.description ?? "",
            subcommands: this.getSubcommandsArray().map((s) => s.exportHelp())
        };
    }
}

export default MiauSlashSubcommandgroupBuilder;
