import { ApplicationCommandType, MessageContextMenuCommandInteraction } from "discord.js";
import MiauContextMenu from "./contextMenu";

export default class MiauMessageContextMenu extends MiauContextMenu {
    constructor(name: string) {
        super(ApplicationCommandType.Message, name)
    }

    override setExecution(fun: (interaction: MessageContextMenuCommandInteraction) => Promise<any>): this {
        (this.execution as (interaction: MessageContextMenuCommandInteraction) => Promise<any>) = fun;
        return this;
    }
}