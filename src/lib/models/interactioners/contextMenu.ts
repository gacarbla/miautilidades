import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandType, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import MiauInteraction from "./interaction";

export default class MiauContextMenu extends MiauInteraction {
    public data: ContextMenuCommandBuilder;

    constructor(type: ApplicationCommandType.Message | ApplicationCommandType.User, name: string) {
        super();
        this.data = new ContextMenuCommandBuilder()
            .setName(name)
            .setType(type as ContextMenuCommandType);
    }

    override async execution(interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction): Promise<any> {
        await interaction.reply({ content: 'Comando recibido, pero... No sé qué debo hacer ahora...', ephemeral: true });
    }

    override setExecution(fun: (interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) => Promise<any>): this {
        (this.execution as (interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) => Promise<any>) = fun;
        return this;
    }

    toJSON(): object {
        return this.data.toJSON();
    }

    override async execute(interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction): Promise<any> {
        try {
            const passed = await this.checkPreconditions(interaction);
            if (!passed) {
                await interaction.reply({ content: '❌ No tienes permisos para usar este comando.', ephemeral: true });
                return;
            }
            await this.execution(interaction);
        } catch (err) {
            await interaction.reply({ content: '❌ Error al procesar el comando.', ephemeral: true });
            console.error("[ContextMenu Execution Error]", err);
        }
    }
}