import { AnySelectMenuInteraction } from "discord.js";
import { MiauSelectDefaultData } from "../../interfaces/interaction";
import MiauInteraction from "./interaction";

export default class MiauSelect extends MiauInteraction {
    protected data:MiauSelectDefaultData
    constructor(data: MiauSelectDefaultData) {
        super();
        this.data = data;
    }

    /**
     * Método `execute` inicial, que se sobrescribirá usando `setExecution`.
     * @param context - Contexto de la interacción de botón.
     */
    override async execute(context: AnySelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Select Menu respondido, pero no se ha definido acción específica." });
    }

    /**
     * Método para sobrescribir `execute` con una nueva función.
     * @param fun - Nueva función de ejecución que manejará el evento del botón.
     */
    override setExecution(f: (context: AnySelectMenuInteraction) => Promise<void>): void {
        this.execute = f;
    }
}