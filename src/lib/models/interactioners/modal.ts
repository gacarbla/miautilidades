import { ModalSubmitInteraction } from "discord.js";
import Emoji from "../../enum/emojis";
import { MiauModalDefaultData } from "../../interfaces/interaction";
import MiauInteraction from "./interaction";
import { ProtectedCollection } from "../collection";

export default class MiauModal extends MiauInteraction {
    protected data: MiauModalDefaultData

    constructor(data: MiauModalDefaultData) {
        super();
        if (data.customId.includes("_")) throw new Error('La ID del botón no puede contener el símbolo \'_\'')
        this.data = data
    }

    override noPermissionMenssage: string = Emoji.ERROR + "No tienes permisos suficientes para utilizar este modal.";

    build() {

    }

    override async execution(context: ModalSubmitInteraction, _: ProtectedCollection<string|number>): Promise<void> {
        await context.reply({ content: "¡Qué bien, el modal funciona!\nPero... Mi programador no me ha dicho qué tengo que hacer ahora...", ephemeral: true });
    }

    override setExecution(f: (context: ModalSubmitInteraction, params: ProtectedCollection<string|number>) => Promise<void>): void {
        this.execution = f
    }
}