import { SlashCommandBuilder } from "discord.js";
import ChatInputCommand from "../lib/classes/chatInputCommand.js";

const podcastCommand = new ChatInputCommand({
    name: "registrar",
    roles: [],
    builder: new SlashCommandBuilder()
        .setName('registrar')
        .setDescription('Registrar preguntas del evento')
        .addStringOption(opt =>
            opt
                .setName("pregunta")
                .setDescription("Pregunta que se le formulará al usuario")
                .setMinLength(5)
                .setMaxLength(256)
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName("correcta")
                .setDescription("Respuesta correcta a la pregunta")
                .setMinLength(1)
                .setMaxLength(16)
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName("relleno1")
                .setDescription("Respuesta correcta a la pregunta")
                .setMinLength(1)
                .setMaxLength(16)
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName("relleno2")
                .setDescription("Respuesta correcta a la pregunta")
                .setMinLength(1)
                .setMaxLength(16)
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName("relleno3")
                .setDescription("Respuesta correcta a la pregunta")
                .setMinLength(1)
                .setMaxLength(16)
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt
                .setName("descripcion")
                .setDescription("Descripción de la pregunta")
                .setMinLength(5)
                .setMaxLength(512)
                .setRequired(false)
        )
})

export default podcastCommand