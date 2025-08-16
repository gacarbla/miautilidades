import { ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
import MiauContextMenu from "./contextMenu";

export default class MiauUserContextMenu extends MiauContextMenu {
    constructor(name: string) {
        super(ApplicationCommandType.User, name)
    }
    
    override setExecution(fun: (interaction: UserContextMenuCommandInteraction) => Promise<any>): this {
        (this.execution as (interaction: UserContextMenuCommandInteraction) => Promise<any>) = fun;
        return this;
    }
}