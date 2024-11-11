import { ComponentType, MentionableSelectMenuInteraction } from "discord.js";
import MiauSelect from "./select";
import { MiauMentionableSelectDefaultData } from "../../interfaces/select";

export default class MiauMentionableSelect extends MiauSelect {
    constructor(data: Omit<MiauMentionableSelectDefaultData, 'type'>) {
        super({...data, type: ComponentType.MentionableSelect});
    }

    override async execution(context: MentionableSelectMenuInteraction, params: string[]): Promise<void> {
        await context.reply({ content: "Menú de selección de mencionable respondido, pero no se ha definido acción específica.", ephemeral: true });
    }

    override setExecution(f: (context: MentionableSelectMenuInteraction, params: string[]) => Promise<void>): void {
        this.execution = f;
    }
}