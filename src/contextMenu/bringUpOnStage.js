import { ContextMenuCommandBuilder, EmbedBuilder } from "discord.js";
import MessageContextMenuCommand from "../lib/classes/messageContextMenuCommand.js";
import client from "../index.js";
import settings from "../settings.js";

const catchGhost = new MessageContextMenuCommand({
    name: "Subir autor al escenario",
    ephemeralReply: true,
    roles: ["822611433463611433", "1274474611253186704", "1104558118924468234"],
    builder: new ContextMenuCommandBuilder()
        .setName("Subir autor al escenario"),
})

catchGhost.setExecution(async (interaction) => {
    const member = interaction.targetMessage.member
    const stageChannel = interaction.guild.channels.cache.find(ch => `${ch.id}` === settings.podcast[`${interaction.guildId}`].stage);
    
    if (!stageChannel) {
        throw new Error('No se encontró el canal de escenario en este servidor.');
    }

    if (member.voice.channel && interaction.member.voice.channel && member.voice.channel.id == interaction.member.voice.channel.id) {
        await member.voice.setSuppressed(false)
        customLogPodcast(`${interaction.member} ha enviado una solicitud a ${member} para subir al escenario.`, interaction)
        await interaction.editReply({content: 'Usuario subido satisfactoriamente.', ephemeral: true})
    } else {
        await interaction.editReply({content: 'Discord dice que el usuario no está en el escenario.', ephemeral: true})
    }
})

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

export default catchGhost