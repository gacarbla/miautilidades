import { UserSelectMenuInteraction } from "discord.js";
import { MiauUserSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauUserSelect extends MiauSelect {
    protected data: MiauUserSelectDefaultData;
    constructor(data: MiauUserSelectDefaultData) {
        super(data);
        this.data = data;
    }

    /**
     * Método `execute` inicial, que se sobrescribirá usando `setExecution`.
     * @param context - Contexto de la interacción del menú de selección de canales.
     */
    override async execute(context: UserSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    /**
     * Método para sobrescribir `execute` con una nueva función.
     * @param f - Nueva función de ejecución que manejará el evento del menú de selección de canales.
     */
    override setExecution(f: (context: UserSelectMenuInteraction) => Promise<void>): void {
        this.execute = f;
    }
}