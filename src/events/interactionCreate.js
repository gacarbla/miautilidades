import client from "../index.js";

export const name = 'interactionCreate';
export const once = false;

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @returns 
 */
export async function execute(interaction) {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
        }
    } else if (interaction.isAutocomplete()) {

    } else if (interaction.isMessageContextMenuCommand()) {
        const menu = client.contextMenus.get(interaction.commandName)
        if (!menu) return;
        try {
            await menu.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
        }
    } else if (interaction.isUserContextMenuCommand()) {

    }
}
