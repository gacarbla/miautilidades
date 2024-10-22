import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, StageChannel } from "discord.js";
import settings from "../settings.js";
import ChatInputCommand from "../lib/classes/chatInputCommand.js";
import client from "../index.js";
import PodcastManageTime from "../lib/classes/podcastManageTime.js";

const podcastCommand = new ChatInputCommand({
    name: "podcast",
    roles: ["822611433463611433", "1274474611253186704", "1104558118924468234"],
    builder: new SlashCommandBuilder()
        .setName('podcast')
        .setDescription('Gestión de podcast')
        .addSubcommand(sub =>
            sub
                .setName('start')
                .setNameLocalizations({
                    "es-419": "iniciar",
                    "es-ES": "iniciar"
                })
                .setDescription('Inicia el podcast')
        )
        .addSubcommand(sub =>
            sub
                .setName('end')
                .setNameLocalizations({
                    "es-419": "finalizar",
                    "es-ES": "finalizar"
                })
                .setDescription('Termina el podcast')
        )
        .addSubcommand(sub =>
            sub
                .setName('pause')
                .setNameLocalizations({
                    "es-419": "pausar",
                    "es-ES": "pausar"
                })
                .setDescription('Pausa el podcast')
        )
        .addSubcommand(sub =>
            sub
                .setName('resume')
                .setNameLocalizations({
                    "es-419": "reanudar",
                    "es-ES": "reanudar"
                })
                .setDescription('Reanuda el podcast')
        )
        .addSubcommand(sub =>
            sub
                .setName('bringup')
                .setNameLocalizations({
                    "es-419": "subir",
                    "es-ES": "subir"
                })
                .setDescription('Sube a un usuario bajo ciertas condiciones')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setNameLocalizations({
                            "es-419": "usuario",
                            "es-ES": "usuario"
                        })
                        .setDescription('Usuario al que subir')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('minutes')
                        .setNameLocalizations({
                            "es-419": "minutos",
                            "es-ES": "minutos"
                        })
                        .setDescription('Máximo de minutos que el usuario dispone')
                        .setMinValue(1)
                        .setMaxValue(30)
                        .setRequired(false)
                )
        )
        /*
        .addSubcommand(sub =>
            sub
                .setName('random-bringup')
                .setDescription('Sube a un usuario aleatorio bajo ciertas condiciones')
                .addIntegerOption(option =>
                    option
                        .setName('minutos')
                        .setDescription('Máximo de minutos que el usuario dispone')
                        .setMinValue(1)
                        .setMaxValue(30)
                        .setRequired(false)
                )
        )*/,
});

let podcasts = [];

/**
 * Establece la ejecución del comando
 */
podcastCommand.setExecution(async (interaction) => {
    const subcommand = interaction.options.getSubcommand();

    if (!interaction.isRepliable()) {
        throw new Error("El comando no se puede contestar.");
    }

    try {
        await interaction.deferReply({ ephemeral: true });
    } catch (error) {
        throw new Error(`Error al intentar deferReply:\n\`\`\`${error.message}\`\`\``);
    }

    const chat = interaction.guild.channels.cache.get(settings.podcast[`${interaction.guildId}`].chat);
    const audienceRole = interaction.guild.roles.cache.get(settings.podcast[`${interaction.guildId}`].audienceRole);

    if (!chat) {
        throw new Error(`No se encontró el canal de chat con ID \`${settings.podcast[`${interaction.guildId}`].chat}\`.`);
    }
    if (!audienceRole) {
        throw new Error(`No se encontró el rol de audiencia con ID \`${settings.podcast[`${interaction.guildId}`].audienceRole}\`.`);
    }

    try {
        switch (subcommand) {
            case "start":
                await handleStart(interaction, chat, audienceRole);
                break;
            case "end":
                await handleEnd(interaction, chat, audienceRole);
                break;
            case "pause":
                await handlePause(interaction);
                break;
            case "resume":
                await handleResume(interaction);
                break;
            case "bringup":
                await handleSubir(interaction);
                break;
            default:
                throw new Error("Subcomando no válido.");
        }
    } catch (error) {
        console.log(error.stack)
        throw new Error(`Error ejecutando el comando podcast:\n\`\`\`${error.message}\`\`\``);
    }
});

/**
 * Maneja el inicio del podcast
 */
async function handleStart(interaction, chat, audienceRole) {
    if (!isPodcastIndexed(interaction.guildId)) {
        const podcastTime = new PodcastManageTime(interaction.guildId);
        podcastTime.setListener(logTime);
        podcastTime.actions.start();
        podcasts.push(podcastTime);
        logPodcast("START", interaction);

        try {
            await setChannelPermission(chat, audienceRole, true);
            await interaction.editReply({ content: "Podcast iniciado. ¡Chat abierto!" });
            console.log("Podcast iniciado exitosamente.");
        } catch (error) {
            throw new Error(`Podcast iniciado, pero ocurrió un error al abrir el chat.`);
        }
    } else {
        throw new Error("Intento de iniciar un podcast mientras ya hay uno registrado.");
    }
}

/**
 * Maneja la finalización del podcast
 */
async function handleEnd(interaction, chat, audienceRole) {
    if (isPodcastIndexed(interaction.guildId)) {
        let pc = getIndexedPodcast(interaction.guildId);
        pc.actions.end();
        try {
            await setChannelPermission(chat, audienceRole, false);
        } catch (error) {
            throw new Error(`Podcast finalizado, pero no se pudo cerrar el chat.`);
        }
        logPodcast("END", interaction);
        logStats(pc);
        await interaction.editReply({ content: "Podcast finalizado. ¡Chat cerrado!" });
        console.log("Podcast finalizado exitosamente.");
    } else {
        throw new Error("Intento de finalizar un podcast cuando no hay ninguno activo.");
    }
}

/**
 * Maneja la pausa del podcast
 */
async function handlePause(interaction) {
    if (isPodcastIndexed(interaction.guildId)) {
        let pc = getIndexedPodcast(interaction.guildId);
        if (!pc.active) {
            throw new Error("Intento de pausar un podcast que ya está pausado o terminado.");
        }
        pc.actions.pause();
        await interaction.editReply({ content: "Podcast pausado, el tiempo se ha detenido." });
        logPodcast("PAUSE", interaction);
        console.log("Podcast pausado exitosamente.");
    } else {
        throw new Error("Intento de pausar un podcast cuando no hay ninguno activo.");
    }
}

/**
 * Maneja la reanudación del podcast
 */
async function handleResume(interaction) {
    if (isPodcastIndexed(interaction.guildId)) {
        let pc = getIndexedPodcast(interaction.guildId);
        if (!pc.paused) {
            throw new Error("Intento de reanudar un podcast que no está pausado.");
        }
        pc.actions.resume();
        logPodcast("RESUME", interaction);
        await interaction.editReply({ content: "Podcast retomado, el tiempo vuelve a contar." });
        console.log("Podcast reanudado exitosamente.");
    } else {
        throw new Error("Intento de reanudar un podcast cuando no hay ninguno activo.");
    }
}

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
async function handleSubir(interaction) {
    const user = interaction.options.getUser('user', true);
    const member = interaction.options.getMember('user', true);
    var minutes = interaction.options.getInteger('minutes', false);
    const stageChannel = interaction.guild.channels.cache.find(ch => `${ch.id}` === settings.podcast[`${interaction.guildId}`].stage);
    
    if (!stageChannel) {
        throw new Error('No se encontró el canal de escenario en este servidor.');
    }

    const isInStage = member.voice.channel && member.voice.channel.id == stageChannel.id;

    if (isInStage) {
        await member.voice.setSuppressed(false);
        customLogPodcast(`${interaction.member} ha enviado una solicitud a ${member} para subir al escenario${minutes?` por ${minutes} minutos`:''}.`, interaction)
        await interaction.editReply({ content: `Se ha enviado una invitación a ${user}${minutes ? ` válida por ${minutes} minutos` : ``}.` });
    } else {
        return await interaction.editReply({ content: `${user.username} no está en el canal de escenario.` });
    }

    if (!minutes) return

    setTimeout(async () => {
        await member.voice.setSuppressed(true);
    }, minutes * 60 * 1000)
}

/**
 * Verifica si un podcast está registrado
 */
const isPodcastIndexed = (guildId) => podcasts.some(p => p.guildId === guildId);

/**
 * Obtiene el podcast registrado
 */
const getIndexedPodcast = (guildId) => podcasts.find(p => p.guildId === guildId);

/**
 * Modifica los permisos del canal
 */
async function setChannelPermission(channel, role, canWrite) {
    try {
        await channel.permissionOverwrites.edit(role, {
            SendMessages: canWrite
        });
    } catch (error) {
        throw error
    }
}

/**
 * Log del tiempo del podcast
 */
function logTime(time) {
    const channel = client.channels.cache.get(settings.podcast[`${interaction.guildId}`].timelogs);
    if (!channel) {
        throw new Error(`No se encontró el canal de logs del tiempo con ID \`${settings.podcast[`${interaction.guildId}`].timelogs}\`.`);
    }

    const min = Math.floor(time / (1000 * 60));
    const embed = new EmbedBuilder()
        .setDescription(`El podcast lleva activo \`${min}\` minutos.`)
        .setTimestamp();

    channel.send({ embeds: [embed] }).catch(error => {
        throw new Error(`Error al enviar el log del tiempo:\n\`\`\`${error.message}\`\`\``);
    });
}

/**
 * Log de las acciones del podcast
 */
function logPodcast(action, interaction) {
    const channel = client.channels.cache.get(settings.podcast[`${interaction.guildId}`].logs);
    if (!channel) {
        throw new Error(`No se encontró el canal de logs del podcast.\nLos cambios se han efectuado satisfactoriamente.`);
    }

    const actionsMap = {
        END: "finalizado",
        PAUSE: "pausado",
        RESUME: "reanudado",
        START: "iniciado"
    };

    const embed = new EmbedBuilder()
        .setDescription(`${interaction.member} ha ${actionsMap[action]} el podcast.`)
        .setTimestamp();

    channel.send({ embeds: [embed] }).catch(error => {
        throw new Error(`Error al enviar el log del podcast:\n\`\`\`${error.message}\`\`\``);
    });
}

/**
 * Custom log
 */
function customLogPodcast(message, interaction) {
    const channel = client.channels.cache.get(settings.podcast[`${interaction.guildId}`].logs);
    if (!channel) {
        throw new Error(`No se encontró el canal de logs del podcast.\nLos cambios se han efectuado satisfactoriamente.`);
    }

    const embed = new EmbedBuilder()
        .setDescription(message)
        .setTimestamp();

    channel.send({ embeds: [embed] }).catch(error => {
        throw new Error(`Error al enviar el log del podcast:\n\`\`\`${error.message}\`\`\``);
    });
}

/**
 * Log de las estadísticas del podcast
 */
function logStats(podcast) {
    const time = podcast.actualtime;
    const channel = client.channels.cache.get(settings.podcast[`${interaction.guildId}`].logs);
    if (!channel) {
        throw new Error(`No se encontró el canal de logs del podcast.\nEl podcast se ha detenido exitosamente.`);
    }

    const embed = new EmbedBuilder()
        .setTitle('Estadísticas del podcast')
        .addFields([
            { name: 'Inicio', value: `<t:${Math.floor(podcast.firstStart / 1000)}:f>`, inline: true },
            { name: 'Fin', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true },
            { name: '** **', value: '** **', inline: false },
            { name: 'Pausas', value: `\`${podcast.pausedTimes}\``, inline: true },
            { name: 'Duración', value: `\`${time.formatted}\``, inline: true }
        ])
        .setColor(0x5865f2)
        .setTimestamp();

    channel.send({ embeds: [embed] }).catch(error => {
        throw new Error(`Error al enviar las estadísticas del podcast:\n\`\`\`${error.message}\`\`\``);
    });

    podcasts = podcasts.filter(p => p.guildId !== podcast.guildId);
}

export default podcastCommand;
