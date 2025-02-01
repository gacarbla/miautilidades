import { UserContextMenuCommandInteraction } from "discord.js";
import MiauContextMenu from "./contextMenu";

export default class MiauUserContextMenu extends MiauContextMenu {
    override setExecution(fun: (interaction: UserContextMenuCommandInteraction) => Promise<void>): void {
        (this.execution as (interaction: UserContextMenuCommandInteraction) => Promise<void>) = fun;
    }
}