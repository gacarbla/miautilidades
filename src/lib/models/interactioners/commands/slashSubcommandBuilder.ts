import { ChatInputCommandInteraction } from "discord.js";
import { ProtectedCollection } from "../../collection";
import { MiauSlashCommandParam } from "../../../interfaces/interaction";
import client from "../../../..";
import { interactionNameRegEx } from "../../../constants/discord";
import Preconditions from "../../preconditions";

class MiauSlashSubcommandBuilder<
    TParams extends Record<string, MiauSlashCommandParam> = {}
> {
    constructor(init?: {
        params?: TParams;
        name?: string;
        description?: string;
        execution?: (
            interaction: ChatInputCommandInteraction,
            params: ProtectedCollection<MiauSlashCommandParam>
        ) => Promise<void>;
        preconditions?: Preconditions[];
    }) {
        if (init?.params) this.params = init.params;
        if (init?.name) this.name = init.name;
        if (init?.description) this.description = init.description;
        if (init?.execution) this.execution = init.execution;
        if (init?.preconditions) this.preconditions = init.preconditions;
    }

    private console = client.utils.console;

    async execution(
        interaction: ChatInputCommandInteraction,
        _: ProtectedCollection<MiauSlashCommandParam>
    ): Promise<void> {
        await interaction.reply({
            content: "Es gracioso, pero yo no conozco este comando..."
        });
    }

    // ⬇️ Cambiamos a Record para poder autocompletar por clave
    private params: TParams = {} as TParams;

    name: string | undefined = undefined;
    description: string | undefined = undefined;

    private preconditions: Preconditions[] = [];

    addPreconditions(...preconditions: Preconditions[]): this {
        this.preconditions.push(...preconditions);
        return this;
    }

    getPreconditions(): Preconditions[] {
        return this.preconditions;
    }

    // ----- setters -----
    setName(name: string): this {
        if (name.length < 1 || name.length > 32) {
            this.console.error(
                ["error", "commandBuildError"],
                "Tamaño incorrecto en el nombre. Debe ser de 1 a 32 caracteres."
            );
            throw new Error("El nombre debe tener entre 1 y 32 caracteres.");
        }
        if (name !== name.toLowerCase()) {
            this.console.warning(
                ["commandBuildError"],
                "Los comandos slash no aceptan mayúsculas en su nombre."
            );
        }
        if (!interactionNameRegEx.test(name)) {
            this.console.error(
                ["error", "commandBuildError"],
                "El nombre contiene caracteres inválidos."
            );
            throw new Error("El nombre contiene caracteres inválidos.");
        }
        this.name = name;
        return this;
    }

    setDescription(description: string): this {
        if (description.length < 1) {
            this.console.error(
                ["error", "commandBuildError"],
                "La descripción debe tener al menos un carácter."
            );
            throw new Error("La descripción debe tener al menos un carácter.");
        }
        if (description.length > 100) {
            this.console.warning(
                ["commandBuildError"],
                "La descripción no puede exceder los 100 caracteres."
            );
            description = description.substring(0, 100);
        }
        this.description = description;
        return this;
    }

    setExecution(
        f: (
            interaction: ChatInputCommandInteraction,
            params: ProtectedCollection<MiauSlashCommandParam>
        ) => Promise<void>
    ): this {
        this.execution = f;
        return this;
    }

    // ----- addParam con sobrecargas -----
    // 1) clave explícita
    addParam<K extends string, P extends MiauSlashCommandParam>(
        key: K,
        param: P
    ): this;
    // 2) usar param.customId como clave
    addParam<P extends MiauSlashCommandParam & { customId: string }>(
        param: P
    ): this;
    // implementación
    addParam(a: any, b?: any): this {
        const key: string = typeof a === "string" ? a : a.customId;
        const param: MiauSlashCommandParam =
            typeof a === "string" ? b : (a as MiauSlashCommandParam);

        if (!client.utils.Interactions.verify.param.slash(param)) {
            throw new Error("Parámetro con estructura incorrecta.");
        }
        if (this.params[key as keyof TParams]) {
            this.console.error(
                ["error", "commandBuildError"],
                `Parámetro duplicado: '${key}'.`
            );
            throw new Error(`Ya existe un parámetro con customId '${key}'.`);
        }

        (this.params as Record<string, MiauSlashCommandParam>)[key] = param;
        return this;
    }

    // ----- acceso tipado -----
    getParams(): TParams {
        return this.params;
    }

    // helpers para iterar/validar como array
    getParamsArray(): MiauSlashCommandParam[] {
        return Object.values(this.params);
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

        const paramsArr = this.getParamsArray();

        const allParamsValid = paramsArr.every((p) =>
            client.utils.Interactions.verify.param.slash(p)
        );

        // al ser Record, las keys ya son únicas; por si acaso verificamos por customId:
        const noDuplicates =
            new Set(paramsArr.map((p) => p.customId)).size === paramsArr.length;

        return nameOk && descOk && allParamsValid && noDuplicates;
    }

    toJSON() {
        if (!this.test()) {
            this.console.error(
                ["error", "commandBuildError"],
                "El subcomando no es válido."
            );
            throw new Error("El subcomando no es válido.");
        }

        return {
            name: this.name!.toLowerCase(),
            description: this.description!,
            type: 1, // Subcommand
            options: this.paramsToOptionsJSON()
        };
    }

    private paramsToOptionsJSON() {
        const arr = this.getParamsArray();

        arr.forEach((param) => {
            this.console.log(["commandBuildLog"], `Comprobando parámetro ${param.customId}`);
            if (!client.utils.Interactions.verify.param.slash(param)) {
                throw new Error("Existen parámetros inválidos:\n" + JSON.stringify(param));
            }
        });

        const hasDuplicates = arr.some(
            (param, idx) => arr.findIndex((p) => p.customId === param.customId) !== idx
        );
        if (hasDuplicates) {
            this.console.error(
                ["error", "commandBuildError"],
                "Dos o más parámetros tienen la misma ID."
            );
            throw new Error("Dos o más parámetros tienen la misma ID.");
        }

        return arr.map((param) => {
            const baseOption: any = {
                type: param.type,
                name: param.customId.toLowerCase(),
                description: param.description,
                required: param.required ?? false
            };

            if ("choices" in param && Array.isArray((param as any).choices)) {
                Object.assign(baseOption, { choices: (param as any).choices });
            }

            return baseOption;
        });
    }

    exportHelp(): { name: string; description: string; params: string[] } {
        return {
            name: this.name ?? "desconocido",
            description: this.description ?? "",
            params: this.getParamsArray().map((p) => `${p.customId}${p.required ? "*" : ""}`)
        };
    }
}

export default MiauSlashSubcommandBuilder;
