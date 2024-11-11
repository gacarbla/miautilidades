import { ComponentType, RoleSelectMenuInteraction } from "discord.js";
import { MiauRoleSelectDefaultData } from "../../interfaces/select";
import MiauSelect from "./select";

export default class MiauRoleSelect extends MiauSelect {
    constructor(data: Omit<MiauRoleSelectDefaultData, 'type'>) {
        super({...data, type: ComponentType.RoleSelect});
    }

    override async execution(context: RoleSelectMenuInteraction, params: string[]): Promise<void> {
        await context.reply({ content: "Menú de selección de mencionable respondido, pero no se ha definido acción específica.", ephemeral: true });
    }

    override setExecution(f: (context: RoleSelectMenuInteraction, params: string[]) => Promise<void>): void {
        this.execution = f;
    }
}