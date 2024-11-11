import { ComponentType, UserSelectMenuInteraction } from "discord.js";
import MiauSelect from "./select";
import { MiauUserSelectDefaultData } from "../../interfaces/select";

export default class MiauUserSelect extends MiauSelect {
    constructor(data: Omit<MiauUserSelectDefaultData, 'type'>) {
        super({...data, type: ComponentType.UserSelect});
    }

    override async execution(context: UserSelectMenuInteraction, params: string[]): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    override setExecution(f: (context: UserSelectMenuInteraction, params: string[]) => Promise<void>): void {
        this.execution = f;
    }
}