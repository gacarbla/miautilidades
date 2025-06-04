import { ComponentType, StringSelectMenuInteraction } from "discord.js";
import MiauSelect from "./select";
import { MiauStringSelectDefaultData } from "../../interfaces/select";
import { ProtectedCollection } from "../collection";

export default class MiauStringSelect extends MiauSelect {
    constructor(data: Omit<MiauStringSelectDefaultData, 'type'>) {
        super({...data, type: ComponentType.StringSelect});
    }
    override async execution(context: StringSelectMenuInteraction, _: ProtectedCollection<string|number>): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    override setExecution(f: (context: StringSelectMenuInteraction, params: ProtectedCollection<string|number>) => Promise<void>): this {
        this.execution = f;
        return this
    }
}