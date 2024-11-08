import { RoleSelectMenuInteraction } from "discord.js";
import { MiauRoleSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauRoleSelect extends MiauSelect {
    protected data: MiauRoleSelectDefaultData;
    constructor(data: MiauRoleSelectDefaultData) {
        super(data);
        this.data = data;
    }

    /**
     * Método `execute` inicial, que se sobrescribirá usando `setExecution`.
     * @param context - Contexto de la interacción del menú de selección de canales.
     */
    override async execute(context: RoleSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    /**
     * Método para sobrescribir `execute` con una nueva función.
     * @param f - Nueva función de ejecución que manejará el evento del menú de selección de canales.
     */
    override setExecution(f: (context: RoleSelectMenuInteraction) => Promise<void>): void {
        this.execute = f;
    }
}