import { ButtonInteraction, Interaction, Message } from "discord.js";

export default abstract class MiauInteraction {
    private preconditions = {}

    constructor() {}

    /**
     * Método abstracto de ejecución que deberá ser implementado o sobrescrito.
     */
    abstract execute(context: Message | Interaction): Promise<void>;

    /**
     * Método para establecer una nueva función de ejecución.
     * La función `fun` debe coincidir con la firma de `execute`.
     */
    setExecution(fun: (context: Message | Interaction) => Promise<void>): void {
        (this.execute as (context: Message | Interaction) => Promise<void>) = fun;
    }

    /**
     * Maneja el caso en que la interacción no se encuentre.
     */
    protected async handleNotFound(context: Message | Interaction) {
        const response = { content: "Oh no, parece ser que este comando o interacción no existe!\nQué raro que el bot lo haya detectado..." };

        if (context instanceof Message) {
            await context.reply(response);
        } else if (context instanceof ButtonInteraction) {
            await context.reply({ ...response, ephemeral: true });
        }
    }
}
