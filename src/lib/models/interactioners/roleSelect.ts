import { ComponentType, RoleSelectMenuInteraction } from "discord.js";
import { MiauRoleSelectDefaultData } from "../../interfaces/select";
import MiauSelect from "./select";
import { ProtectedCollection } from "../collection";

export default class MiauRoleSelect extends MiauSelect {
    constructor(data: Omit<MiauRoleSelectDefaultData, 'type'>) {
        super({...data, type: ComponentType.RoleSelect});
    }

    override async execution(context: RoleSelectMenuInteraction, _: ProtectedCollection<string|number>): Promise<any> {
        await context.reply({ content: "Menú de selección de mencionable respondido, pero no se ha definido acción específica.", ephemeral: true });
    }

    override setExecution(f: (context: RoleSelectMenuInteraction, params: ProtectedCollection<string|number>) => Promise<any>): this {
        this.execution = f;
        return this
    }
}