import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";

const catchGhost = {
    data: new ContextMenuCommandBuilder()
        .setType(ApplicationCommandType.Message)
        .setName("Cazar fantasma"),
    execute: async (client) => {

    }
}

export default catchGhost