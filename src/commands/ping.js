import { SlashCommandBuilder } from "discord.js";
import InteractionBuilder from "../lib/classes/interactionBuilder.js";

const pingCommand = new InteractionBuilder({
    name: 'ping',
    alias: ['pong', 'test'],
    description: 'Comando para probar que el bot funciona correctamente',
    type: ["message", "slashCommand", "contextMenu"]
})

pingCommand.addBuilder("slashCommand", new SlashCommandBuilder())

export default pingCommand