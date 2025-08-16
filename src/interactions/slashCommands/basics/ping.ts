import { MiauMessageCommand } from "../../../lib/models/interactions";

const ping = new MiauMessageCommand({
    name: "ping",
    alias: ["pong"],
    description: "Responde con \"pong!\"",
    isRestricted: false
});

export const ping_builder = ping.builder
    .setExecution(async (message, _) => {
        message.reply({content: "Pong!"})
    })

export default ping