import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import settings from "../settings.js";

const podcastCommand = {
    data: new SlashCommandBuilder()
        .setName('podcast')
        .setDescription('Gestión de podcast')
        .addSubcommand(sub =>
            sub
                .setName('start')
                .setDescription('Inicia el podcast')
        )
        .addSubcommand(sub =>
            sub
                .setName('end')
                .setDescription('Termina el podcast')
        )
        .addSubcommand(sub =>
            sub
                .setName('pause')
                .setDescription('Pausa el podcast')
        )
        .addSubcommand(sub =>
            sub
                .setName('resume')
                .setDescription('Reanuda el podcast')
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand()
        if (!interaction.isRepliable()) return console.error("No se puede contestar")
        await interaction.deferReply()
        switch (subcommand) {
            case "start":
                break;
            case "end":
                break;
            case "pause":
                break;
            case "resume":
                break;
            default:
                interaction.editReply({content: "Error al conectar con el comando", ephemeral: true})
                break;
        }
    }
}

/**
 * 
 * @param {"START"|"END"|"PAUSE"|"RESUME"} action 
 * @param {string} authorId 
 * @param {Client} client 
 */
function logPodcast(action, authorId, client) {
    const channel = client.channels.cache.get(settings.podcast.logs);
    if (!channel) {
        console.error('No se encontró el canal. Verifica la ID.');
        return;
    }

    var _action = ""

    switch (action) {
        case "END":
            _action = "finalizado"
            break;
        case "PAUSE":
            _action = "pausado"
            break;
        case "RESUME":
            _action = "reanudado"
            break;
        case "START":
            _action = "iniciado"
            break;
    }

    const embed = new EmbedBuilder()
        .setDescription(`<@${authorId}> ha ${_action} el podcast.`)
        .setTimestamp();

    channel.send({ embeds: [embed] })
        .catch(console.error);
}

export default podcastCommand