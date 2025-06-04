import { ChatInputCommandInteraction } from "discord.js";
import { ProtectedCollection } from "../../collection";
import { MiauSlashCommandParam } from "../../../interfaces/interaction";
import client from "../../../..";
import { interactionNameRegEx } from "../../../constants/discord";
import Preconditions from "../../preconditions";

class MiauSlashSubcommandBuilder {
    constructor() { }

    private console = client.utils.console

    async execution(interaction: ChatInputCommandInteraction, _: ProtectedCollection<MiauSlashCommandParam>): Promise<void> {
        await interaction.reply({ content: 'Es gracioso, pero yo no conozco este comando...' })
    }

    params: MiauSlashCommandParam[] = []
    name: string | undefined = undefined
    description: string | undefined = undefined

    private preconditions: Preconditions[] = [];

    addPreconditions(...preconditions: Preconditions[]): this {
        this.preconditions.push(...preconditions);
        return this;
    }

    getPreconditions(): Preconditions[] {
        return this.preconditions;
    }


    setName(name: string): this {
        if (name.length < 1 || name.length > 32) {
            this.console.error(
                ["error", "commandBuildError"],
                "Tamaño incorrecto en el nombre. Debe ser de 1 a 32 caracteres."
            );
            throw new Error("El nombre debe tener entre 1 y 32 caracteres.");
        }
        if (name != name.toLowerCase()) {
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
        this.name = name
        return this
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
        // TODO: Verifica que los caracteres empleados son válidos.
        this.description = description
        return this
    }

    setExecution(f: (interaction: ChatInputCommandInteraction, params: ProtectedCollection<MiauSlashCommandParam>) => Promise<void>): this {
        // TODO: Verificación de que la función es válida.
        this.execution = f
        return this
    }

    addParam(param: MiauSlashCommandParam): this {
        if (!client.utils.Interactions.verify.param.slash(param)) throw new Error("Parámetro con estructura incorrecta.")
        // TODO: Verificación de que no hay ya un parámetro con ese nombre.
        this.params.push(param)
        return this
    }

    test(): boolean {
        const nameOk =
            typeof this.name === 'string' &&
            interactionNameRegEx.test(this.name) &&
            this.name.length >= 1 &&
            this.name.length <= 32;

        const descOk =
            typeof this.description === 'string' &&
            this.description.length >= 1 &&
            this.description.length <= 100;

        const allParamsValid =
            this.params.every(p => client.utils.Interactions.verify.param.slash(p));

        const noDuplicates =
            new Set(this.params.map(p => p.customId)).size === this.params.length;

        return nameOk && descOk && allParamsValid && noDuplicates;
    }




    toJSON() {
        if (!this.test()) {
            this.console.error(["error", "commandBuildError"], "El subcomando no es válido.");
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
        this.params.forEach(param => {
            this.console.log(["commandBuildLog"], `Comprobando parámetro ${param.customId}`);

            if (!client.utils.Interactions.verify.param.slash(param)) {
                throw new Error("Existen parámetros inválidos:\n" + JSON.stringify(param));
            }
        });

        const hasDuplicates = this.params.some((param, index, array) =>
            array.findIndex(p => p.customId === param.customId) !== index
        );

        if (hasDuplicates) {
            this.console.error(['error', 'commandBuildError'], 'Dos o más parámetros tienen la misma ID.');
            throw new Error("Dos o más parámetros tienen la misma ID.");
        }

        return this.params.map(param => {
            const baseOption = {
                type: param.type, // Asegúrate de que es un número válido para la API de Discord
                name: param.customId.toLowerCase(),
                description: param.description,
                required: param.required ?? false,
            };

            if ('choices' in param && Array.isArray(param.choices)) {
                Object.assign(baseOption, { choices: param.choices });
            }

            return baseOption;
        });
    }

    exportHelp(): { name: string, description: string, params: string[] } {
        return {
            name: this.name ?? "desconocido",
            description: this.description ?? "",
            params: this.params.map(p => `${p.customId}${p.required ? '*' : ''}`)
        };
    }

}

export default MiauSlashSubcommandBuilder