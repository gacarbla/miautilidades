import { MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import MiauInteraction from "./interaction";

export default class MiauContextMenu extends MiauInteraction {

    override async execution(interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction):Promise<void> {
        await interaction.reply({content: 'Comando recibido, pero... No sé qué debo hacer ahora...', ephemeral: true})
    }

    override setExecution(fun: (interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) => Promise<void>): void {
        (this.execution as (interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) => Promise<void>) = fun;
    }

}