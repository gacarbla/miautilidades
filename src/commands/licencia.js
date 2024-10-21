import { SlashCommandBuilder } from "discord.js";
import ChatInputCommand from "../lib/classes/chatInputCommand.js";

const licenciaCommand = new ChatInputCommand({
    name: "licencia",
    roles: [],
    builder: new SlashCommandBuilder()
        .setName('licencia')
        .setDescription('Consigue tu licencia de cazador de fantasmas')
})

export default licenciaCommand