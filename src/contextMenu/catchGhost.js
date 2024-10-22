import { ContextMenuCommandBuilder } from "discord.js";
import MessageContextMenuCommand from "../lib/classes/messageContextMenuCommand.js";
import client from "../index.js";

const catchGhost = new MessageContextMenuCommand({
    name: "Cazar fantasma",
    messageAuthorID: ["1297937802209656843", "1122989140594655282", "1109945400066060399"],
    builder: new ContextMenuCommandBuilder()
        .setName("Cazar fantasma"),
})

catchGhost.setExecution(async (interaction) => {
    let content = interaction.targetMessage.content
    if (content.startsWith('## Fantaaasmaaa')) {
        
        setTimeout(()=> {
            if (interaction.targetMessage.deletable) {
                interaction.targetMessage.delete()
            }
        }, 3000)
    }
})

export default catchGhost