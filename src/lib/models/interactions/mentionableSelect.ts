import { MentionableSelectMenuInteraction } from "discord.js";
import { MiauMentionableSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauMentionableSelect extends MiauSelect {
    protected data: MiauMentionableSelectDefaultData;
    constructor(data: MiauMentionableSelectDefaultData) {
        super(data);
        this.data = data;
    }

    override async execution(context: MentionableSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    override setExecution(f: (context: MentionableSelectMenuInteraction) => Promise<void>): void {
        this.execution = f;
    }
}