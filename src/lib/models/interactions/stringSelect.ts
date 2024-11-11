import { ComponentType, StringSelectMenuInteraction } from "discord.js";
import MiauSelect from "./select";
import { MiauStringSelectDefaultData } from "../../interfaces/select";

export default class MiauStringSelect extends MiauSelect {
    constructor(data: Omit<MiauStringSelectDefaultData, 'type'>) {
        super({...data, type: ComponentType.StringSelect});
    }
    override async execution(context: StringSelectMenuInteraction, params: string[]): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    override setExecution(f: (context: StringSelectMenuInteraction, params: string[]) => Promise<void>): void {
        this.execution = f;
    }
}