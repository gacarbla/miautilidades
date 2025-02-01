import { ChatInputCommandInteraction } from "discord.js";
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
    
    }

    builder:MiauSlashCommandBuilder = new MiauSlashCommandBuilder()
}