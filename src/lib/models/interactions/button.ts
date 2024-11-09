import { ButtonBuilder, ButtonInteraction, ButtonStyle, Interaction, Message } from "discord.js";
import MiauInteraction from "./interaction";
import { MiauButtonDefaultData } from "../../interfaces/interaction";
import Emoji from "../../enum/emojis";
import client from "../../..";
import { MiauButtonBuildData } from "../../interfaces/button";

export default class MiauButton extends MiauInteraction {
    protected data: MiauButtonDefaultData
    constructor(data: MiauButtonDefaultData) {
        super();
        this.data = data;
    }

    override noPermissionMenssage: string = Emoji.ERROR + "No tienes permisos para ejecutar este botón"

    protected build(data: MiauButtonBuildData): ButtonBuilder {
        try {
            let id = this.data.customId;

            try {
                data.params?.forEach(param => {
                    if (param.includes("_")) throw new Error("Los parámetros de botones no pueden incluir el símbolo '_'");
                    id += `_${param}`;
                });
                if (id.length > 100) {
                    throw new Error(`La ID del botón excede los 100 caracteres permitidos: ${id}`);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Error desconocido al crear la ID del botón";
                throw new Error(errorMessage);
            }

            client.utils.console.log(['buttonBuildLog'], `Botón construido con ${data.params?.length ?? 0} parámetros.`);

            try {
                const builder = new ButtonBuilder()
                    .setCustomId(id)
                    .setStyle(this.data.style)
                    .setEmoji(data.customEmoji ?? this.data.emoji ?? "")
                    .setDisabled(data.disabled ?? false)
                    .setLabel(data.customLabel ?? this.data.label ?? "");

                client.utils.console.log(['buttonBuildLog'], `Botón creado exitosamente: ${this.data.customId}`);
                return builder;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Error desconocido al crear el botón";
                throw new Error(`Error al construir el botón: ${errorMessage}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al crear el botón";
            client.utils.console.error(['buttonBuildError'], errorMessage)
            throw new Error(errorMessage)
        }
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