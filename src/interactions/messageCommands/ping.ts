import { ActionRowBuilder, ButtonBuilder, type MessageActionRowComponentBuilder } from "discord.js";
import client from "../..";
import { MiauMessageCommand } from "../../lib/models/interactions";

const ping = new MiauMessageCommand({
    name: "ping",
    description: "¡Responde pong!",
    isRestricted: false,
    alias: ["pong", "ping!", "pong!", "¡ping!", "¡pong!"],
});

export const ping_builder = (ping.builder = ping.builder.setExecution(async (message) => {
    const sent = await message.reply({ content: "🏓 Pong..." });

    const rtt = sent.createdTimestamp - message.createdTimestamp;
    const ws = Math.round(message.client.ws.ping ?? 0);

    const button = client.interactions.buttons.get("updatePing")?.build();
    if (!button) throw new Error("No se encontró el botón");

    // ✅ Tipa el row con el tipo de componentes de mensaje
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(button as ButtonBuilder);

    try {
        await sent.edit({
            content: `🏓 Pong!\n⏱️ RTT: ${rtt}ms • WS: ${ws}ms`,
            components: [row],
        });
    } catch {
        await message.reply(`🏓 Pong!\n⏱️ RTT: ${rtt}ms • WS: ${ws}ms`);
    }
}));

export default ping;
