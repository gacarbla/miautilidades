import { ButtonStyle } from "discord.js";
import { MiauButton } from "../../lib/models/interactions";

const UpdatePing = new MiauButton({
    customId: "updatePing",
    label: "Actualizar",
    name: "updatePing",
    isRestricted: false,
    style: ButtonStyle.Primary,
}).setExecution(async (i) => {
    const now = Date.now();
    const rtt = now - i.createdTimestamp;
    const ws = Math.round(i.client.ws.ping ?? 0);

    await i.update({
        content: `🏓 Pong!\n⏱️ RTT: ${rtt}ms • WS: ${ws}ms`,
    });
});

export default UpdatePing;