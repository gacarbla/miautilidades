import { ChannelSelectMenuInteraction } from "discord.js";
import { MiauChannelSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauChannelSelect extends MiauSelect {
    protected data: MiauChannelSelectDefaultData;

    constructor(data: MiauChannelSelectDefaultData) {
        super(data);
        this.data = data;
    }

    /**
     * Método `execute` inicial, que se sobrescribirá usando `setExecution`.
     * @param context - Contexto de la interacción del menú de selección de canales.
     */
    override async execute(context: ChannelSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    /**
     * Método para sobrescribir `execute` con una nueva función.
     * @param f - Nueva función de ejecución que manejará el evento del menú de selección de canales.
     */
    override setExecution(f: (context: ChannelSelectMenuInteraction) => Promise<void>): void {
        this.execute = f;
    }
}
