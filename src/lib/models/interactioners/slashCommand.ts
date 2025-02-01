import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { MiauSlashCommandDefaultData } from "../../interfaces/interaction";
import MiauSlashCommandBuilder from "./commands/slashBuilder";
import MiauInteraction from "./interaction";

export default class MiauSlashCommand extends MiauInteraction {
    data:MiauSlashCommandDefaultData
    constructor(data:MiauSlashCommandDefaultData) {
        super()
        this.data = data
    }

    toJSON():Object {
        return this.builder.toJSON(this.data) 
    }

    override async execution(context: ChatInputCommandInteraction): Promise<void> {
        // TODO: Ejecución de los comandos
        await context.reply({content: '¡Dato curioso!\n¿Sabías que ves este mensaje porque mi desarrollador no ha terminado de programarme y es un perezoso al que le lleva 2 meses hacer un handler?', flags: [MessageFlags.Ephemeral]})
    }

    builder:MiauSlashCommandBuilder = new MiauSlashCommandBuilder()
}