import { ComponentType, MentionableSelectMenuInteraction } from "discord.js";
import MiauSelect from "./select";
import { MiauMentionableSelectDefaultData } from "../../interfaces/select";
import { ProtectedCollection } from "../collection";

export default class MiauMentionableSelect extends MiauSelect {
    constructor(data: Omit<MiauMentionableSelectDefaultData, 'type'>) {
        super({...data, type: ComponentType.MentionableSelect});
    }

    override async execution(context: MentionableSelectMenuInteraction, _: ProtectedCollection<string|number>): Promise<void> {
        await context.reply({ content: "Menú de selección de mencionable respondido, pero no se ha definido acción específica.", ephemeral: true });
    }

    override setExecution(f: (context: MentionableSelectMenuInteraction, params: ProtectedCollection<string|number>) => Promise<void>): this {
        this.execution = f;
        return this
    }
}