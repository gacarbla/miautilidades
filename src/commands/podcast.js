import { EmbedBuilder, GuildChannel, Role, SlashCommandBuilder } from "discord.js";
import settings from "../settings.js";
import ChatInputCommand from "../lib/classes/chatInputCommand.js";
import client from "../index.js";
import PodcastManageTime from "../lib/classes/podcastManageTime.js";

const podcastCommand = new ChatInputCommand({
    name: "podcast",
    roles: ["822611433463611433", "1274474611253186704"],
    builder: new SlashCommandBuilder()
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
})

var podcasts = []

podcastCommand.setExecution((interaction) => {
    return new Promise(async (resolve) => {
        const subcommand = interaction.options.getSubcommand()
        if (!interaction.isRepliable()) return console.error("No se puede contestar")
        await interaction.deferReply({ephemeral: true})
        const chat = interaction.guild.channels.cache.find(ch => ch.id === settings.podcast.chat);
        const audienceRole = interaction.guild.roles.cache.find(role => role.id === settings.podcast.audienceRole)
        switch (subcommand) {
            case "start":
                if (!isPodcastIndexed(interaction.guildId)) {
                    const podcastTime = new PodcastManageTime(interaction.guildId)
                    podcastTime.setListener(logTime)
                    podcastTime.actions.start()
                    podcasts.push(podcastTime)
                    logPodcast("START", interaction.member.id)
                    try {
                        await setChannelPermission(chat, audienceRole, true)
                        await interaction.editReply({ content: "Podcast iniciado. ¡Chat abierto!" })
                    } catch (e) {
                        console.error(e)
                        let embed = new EmbedBuilder().setColor(0xed4245).setDescription('```\n'+e.name+'\n```')
                        await interaction.editReply({ content: "Podcast iniciado. Error al abrir el chat.", embeds: [embed] })
                    }
                } else {
                    await interaction.editReply({ content: "¡Ya hay un podcast registrado!" })
                }
                break;
            case "end":
                if (isPodcastIndexed(interaction.guildId)) {
                    let pc = getIndexedPodcast(interaction.guildId)
                    pc.actions.end()
                    await setChannelPermission(chat, audienceRole, false)
                    logPodcast("END", interaction.member.id)
                    logStats(pc)
                    await interaction.editReply({ content: "Podcast finalizado. ¡Chat cerrado!" })
                } else {
                    await interaction.editReply({ content: "No se ha encontrado ningún podcast activo en el servidor..." })
                }
                break;
            case "pause":
                if (isPodcastIndexed(interaction.guildId)) {
                    let pc = getIndexedPodcast(interaction.guildId)
                    if (!pc.active) return await interaction.editReply({ content: "El podcast ya está pausado o terminado." })
                    pc.actions.pause()
                    await interaction.editReply({ content: "Podcast pausado, el tiempo se ha detenido." })
                    logPodcast("PAUSE", interaction.member.id)
                } else {
                    await interaction.editReply({ content: "No se ha encontrado ningún podcast activo en el servidor..." })
                }
                break;
            case "resume":
                if (isPodcastIndexed(interaction.guildId)) {
                    let pc = getIndexedPodcast(interaction.guildId)
                    if (!pc.paused) return await interaction.editReply({ content: "El podcast no está pausado." })
                    pc.actions.resume()
                    logPodcast("RESUME", interaction.member.id)
                    await interaction.editReply({ content: "Podcast retomado, el tiempo vuelve a contar." })
                } else {
                    await interaction.editReply({ content: "No se ha encontrado ningún podcast activo en el servidor..." })
                }
                break;
            default:
                interaction.editReply({ content: "Error al conectar con el comando" })
                break;
        }
        resolve()
    })
})

/**
 * 
 * @param {string} guildId 
 * @returns {boolean}
 */
const isPodcastIndexed = (guildId) => (podcasts.filter(p => p.guildId == guildId).length > 0)

/**
 * @param {string} guildId
 * @returns {PodcastManageTime}
 */
const getIndexedPodcast = (guildId) => (podcasts.filter(p => p.guildId == guildId)[0])

/**
 * 
 * @param {GuildChannel} channel 
 * @param {Role} role 
 * @param {boolean} canWrite 
 * @returns
 */
const setChannelPermission = (channel, role, canWrite) => {
    return new Promise(async resolve => {
        try {
            await channel.permissionOverwrites.edit(role, {
                SendMessages: canWrite
            })
        } catch (e) {
            throw e
        } finally {
            resolve()
        }
    })
};

/**
 * @param {number} time
 */
function logTime(time) {
    const channel = client.channels.cache.get(settings.podcast.timelogs);
    if (!channel) {
        console.error('No se encontró el canal. Verifica la ID.');
        return;
    }

    let min = Math.floor(time/(1000*60))

    const embed = new EmbedBuilder()
        .setDescription(`El podcast lleva activo \`${min}\` minutos.`)
        .setTimestamp();

    channel.send({ embeds: [embed] })
        .catch(console.error);
}

/**
 * 
 * @param {"START"|"END"|"PAUSE"|"RESUME"} action 
 * @param {string} authorId
 */
function logPodcast(action, authorId) {
    const channel = client.channels.cache.get(settings.podcast.logs);
    if (!channel) {
        console.error('No se encontró el canal. Verifica la ID.');
        return;
    }

    const actionsMap = {
        END: "finalizado",
        PAUSE: "pausado",
        RESUME: "reanudado",
        START: "iniciado"
    };

    const text_action = actionsMap[action];

    const embed = new EmbedBuilder()
        .setDescription(`<@${authorId}> ha ${text_action} el podcast.`)
        .setTimestamp();

    channel.send({ embeds: [embed] })
        .catch(console.error);
}

/**
 * 
 * @param {PodcastManageTime} podcast 
 */
function logStats(podcast) {
    let time = podcast.actualtime
    const channel = client.channels.cache.get(settings.podcast.logs);
    if (!channel) {
        console.error('No se encontró el canal. Verifica la ID.');
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle('Estadísticas del podcast')
        .addFields([
            {name: 'Inicio', value: `<t:${Math.floor(podcast.firstStart/1000)}:f>`, inline: true},
            { name: 'Fin', value: `<t:${Math.floor(Date.now()/1000)}:f>`, inline: true },
            { name: '** **', value: '** **', inline: false },
            { name: 'Pausas', value: `\`${podcast.pausedTimes}\``, inline: true },
            { name: 'Duración', value: `\`${time.formatted}\``, inline: true }
        ])
        .setColor(0x5865f2)
        .setTimestamp();

    channel.send({ embeds: [embed] })
        .catch(console.error);

    podcasts = podcasts.filter(p => p.guildId != podcast.guildId);
}

export default podcastCommand