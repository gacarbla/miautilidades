import { ChatInputCommandInteraction, Client } from "discord.js";
import client from "../index.js";

export const name = 'interactionCreate';
export const once = false;

/**
 * 
 * @param {ChatInputCommandInteraction} interaction
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
    } else if (interaction.isAutocomplete()) {}
}
