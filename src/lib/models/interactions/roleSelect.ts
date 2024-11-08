import { RoleSelectMenuInteraction } from "discord.js";
import { MiauRoleSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauRoleSelect extends MiauSelect {
    protected data: MiauRoleSelectDefaultData;
    constructor(data: MiauRoleSelectDefaultData) {
        super(data);
        this.data = data;
    }

    override async execution(context: RoleSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    override setExecution(f: (context: RoleSelectMenuInteraction) => Promise<void>): void {
        this.execution = f;
    }
}