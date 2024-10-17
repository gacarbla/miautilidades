import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import ContextMenuCommand from "../lib/classes/contextMenuCommand.js";

const catchGhost = new ContextMenuCommand({
    name: "CatchGhost",
    builder: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message)
    .setName("Cazar fantasma"),
})

export default catchGhost