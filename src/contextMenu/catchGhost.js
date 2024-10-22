import { ContextMenuCommandBuilder } from "discord.js";
import MessageContextMenuCommand from "../lib/classes/messageContextMenuCommand.js";

const catchGhost = new MessageContextMenuCommand({
    name: "Cazar fantasma",
    ephemeralReply: true,
    messageAuthorID: ["1297937802209656843", "1122989140594655282", "1109945400066060399"],
    builder: new ContextMenuCommandBuilder()
        .setName("Cazar fantasma"),
})

/*
catchGhost.setExecution(async (interaction) => {
    let content = interaction.targetMessage.content
    if (content.startsWith('## Fantaaasmaaa')) {
        await interaction.editReply({content: "Has cazado un fantasma"})
        setTimeout(()=> {
            if (interaction.targetMessage.deletable) {
                interaction.targetMessage.delete()
            }
        }, 3000)
    }
})
*/

export default catchGhost