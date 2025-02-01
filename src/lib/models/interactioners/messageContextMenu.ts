import { MessageContextMenuCommandInteraction } from "discord.js";
import MiauContextMenu from "./contextMenu";

export default class MiauMessageContextMenu extends MiauContextMenu {
    override setExecution(fun: (interaction: MessageContextMenuCommandInteraction) => Promise<void>): void {
        (this.execution as (interaction: MessageContextMenuCommandInteraction) => Promise<void>) = fun;
    }
}