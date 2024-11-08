import { ButtonInteraction, ButtonStyle, Interaction, Message } from "discord.js";
import MiauInteraction from "./interaction";
import { MiauButtonDefaultData } from "../../interfaces/interaction";

export default class MiauButton extends MiauInteraction {
    protected data:MiauButtonDefaultData
    constructor(data: MiauButtonDefaultData) {
        super();
        this.data = data;
    }

    override async execution(context: ButtonInteraction): Promise<void> {
        await context.reply({ content: "Botón presionado, pero no se ha definido acción específica." });
    }

    /**
     * Método para sobrescribir `execute` con una nueva función.
     * @param fun - Nueva función de ejecución que manejará el evento del botón.
     */
    override setExecution(f: (context: ButtonInteraction) => Promise<void>): void {
        this.execution = f;
    }
}