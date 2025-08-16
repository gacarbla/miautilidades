import { MessageFlags } from "discord.js";
import { MiauSlashCommand } from "../../../lib/models/interactions";

const ping = new MiauSlashCommand({
    name: "ping",
    description: "¡Responde pong!",
    isRestricted: false,
});

export const ping_builder = (ping.builder =
    ping.builder.setExecution(async (i) => {
        const sent = await i.reply({
            content: "🏓 Pong...",
            flags: MessageFlags.Ephemeral,
            fetchReply: true,
        });

        const rtt = sent.createdTimestamp - i.createdTimestamp;
        const ws = Math.round(i.client.ws.ping);

        await i.editReply(`🏓 Pong!\n⏱️ RTT: ${rtt}ms • WS: ${ws}ms`);
    }));

export default ping;
