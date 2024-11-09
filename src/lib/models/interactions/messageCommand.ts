import { Message } from "discord.js";
import Emoji from "../../enum/emojis";
import MiauInteraction from "./interaction";
import { MiauMessageCommandDefaultData } from "../../interfaces/interaction";
import MiauMessageCommandBuilder from "./commands/messageBuilder";

export default class MiauMessageCommand extends MiauInteraction {
    private data: MiauMessageCommandDefaultData
    override noPermissionMenssage: string = Emoji.ERROR + "No tienes permisos para ejecutar este comando";

    constructor(data: MiauMessageCommandDefaultData) {
        super()
        this.data = data
    }

    build = new MiauMessageCommandBuilder()

    override async execution(context: Message): Promise<void> {

    }

    override setExecution: undefined;
}