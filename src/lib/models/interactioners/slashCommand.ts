import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { MiauSlashCommandDefaultData } from "../../interfaces/interaction";
import MiauSlashCommandBuilder from "./commands/slashBuilder";
import MiauInteraction from "./interaction";
import { Collection, ProtectedCollection } from "../collection";
import { Helper } from "../../helpers";

export default class MiauSlashCommand extends MiauInteraction {
    data: MiauSlashCommandDefaultData
    constructor(data: MiauSlashCommandDefaultData) {
        super()
        this.data = data
    }

    toJSON(): Object {
        return this.builder.toJSON(this.data)
    }

    override async execute(context: ChatInputCommandInteraction): Promise<void> {
        try {
            void this.parseParams(context)
            await this.execution(context);
        } catch (error) {
            this.console.error(["commandExecutionError"], `[${context.commandName}] Error de ejecución:`, error);

            const message =
                error instanceof Error
                    ? "❌ Ha ocurrido un error durante la ejecución."
                    : "❌ Oh no... Ha ocurrido un error inesperado durante la ejecución del comando.";

            if (context.replied || context.deferred) {
                await context.followUp({ content: message, ephemeral: true }).catch(() => { });
            } else {
                await context.reply({ content: message, ephemeral: true }).catch(() => { });
            }
        }
    }


    private parseParams(interaction: ChatInputCommandInteraction): ProtectedCollection<any> {
        const collection = new Collection<any>();

        // Antes: const declaredParams = this.builder.params;
        const declaredParams = this.builder.getParamsArray();

        for (const param of declaredParams) {
            const raw = interaction.options.get(param.customId)?.value;

            if (raw === undefined || raw === null) {
                if (param.required) {
                    throw new Error(`El parámetro "${param.name}" es obligatorio.`);
                }
                continue;
            }

            const valid = Helper.CommandParams.verifyParamType("slashcommand", param.type, raw);
            if (!valid) {
                throw new Error(`El valor de "${param.name}" no cumple el tipo "${param.type}".`);
            }

            collection.add(
                {
                    name: param.name,
                    value: raw,
                    type: param.type
                },
                param.customId
            );
        }

        return collection.protected;
    }


    override async execution(context: ChatInputCommandInteraction): Promise<void> {
        await context.reply({ content: '¡Dato curioso!\n¿Sabías que ves este mensaje porque mi desarrollador no ha terminado de programarme y es un perezoso al que le lleva 2 meses hacer un handler?', flags: [MessageFlags.Ephemeral] })
    }

    override setExecution(fun: (context: ChatInputCommandInteraction) => Promise<void>): this {
        (this.execution as (context: ChatInputCommandInteraction) => Promise<void>) = fun;
        return this
    }

    builder: MiauSlashCommandBuilder = new MiauSlashCommandBuilder()
}