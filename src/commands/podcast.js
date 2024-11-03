import { SlashCommandBuilder } from "discord.js";
import InteractionBuilder from "../lib/classes/interactionBuilder.js";

const PodcastCommand = new InteractionBuilder({
    name: 'podcast',
    alias: ['pd', 'podcasts'],
    cooldown: 60,
    description: 'Maneja los podcasts. Debes tener un rol de podcaster o moderador.',
    type: [ 'message', 'slashCommand' ],
    preconditions: [
        {
            whitelistedServers: [ '790289803219566633' ],
            whitelistedRoles: [ '1274474611253186704', '822611433463611433' ]
        },
        {
            whitelistedServers: [ '1071826692764598302' ]
        }
    ]
})

PodcastCommand.addBuilder('slashCommand', new SlashCommandBuilder())

PodcastCommand.setExecution('message', async (message) => {
    message.reply('Funciona')
})

PodcastCommand.setExecution('slashCommand', async (interaction) => {
    await interaction.reply({content: 'Funciona'})
})

export default PodcastCommand
