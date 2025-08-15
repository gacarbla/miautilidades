import { MiauMessageCommand } from "../../../lib/models/interactions";

const ping = new MiauMessageCommand({
    name: "ping",
    alias: ["pong"],
    description: "Responde con \"pong!\"",
    isRestricted: false
});

// 1) Captura la instancia tipada:
const builder = ping.builder
    .addParam({
        customId: "test",
        description: "aaaa",
        name: "test",
        required: false,
        type: "text",
    });

ping.builder = builder;

// 3) Ahora sí, autocompleta:
const p = builder.getParams();
p.test