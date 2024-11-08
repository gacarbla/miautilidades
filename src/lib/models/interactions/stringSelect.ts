import { StringSelectMenuInteraction } from "discord.js";
import { MiauStringSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauStringSelect extends MiauSelect {
    protected data: MiauStringSelectDefaultData;
    constructor(data: MiauStringSelectDefaultData) {
        super(data);
        this.data = data;
    }

    /**
     * Método `execute` inicial, que se sobrescribirá usando `setExecution`.
     * @param context - Contexto de la interacción del menú de selección de canales.
     */
    override async execute(context: StringSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    /**
     * Método para sobrescribir `execute` con una nueva función.
     * @param f - Nueva función de ejecución que manejará el evento del menú de selección de canales.
     */
    override setExecution(f: (context: StringSelectMenuInteraction) => Promise<void>): void {
        this.execute = f;
    }
}