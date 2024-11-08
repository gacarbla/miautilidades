import { MentionableSelectMenuInteraction } from "discord.js";
import { MiauMentionableSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauMentionableSelect extends MiauSelect {
    protected data: MiauMentionableSelectDefaultData;
    constructor(data: MiauMentionableSelectDefaultData) {
        super(data);
        this.data = data;
    }

    /**
     * Método `execute` inicial, que se sobrescribirá usando `setExecution`.
     * @param context - Contexto de la interacción del menú de selección de canales.
     */
    override async execute(context: MentionableSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    /**
     * Método para sobrescribir `execute` con una nueva función.
     * @param f - Nueva función de ejecución que manejará el evento del menú de selección de canales.
     */
    override setExecution(f: (context: MentionableSelectMenuInteraction) => Promise<void>): void {
        this.execute = f;
    }
}