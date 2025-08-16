import { ButtonBuilder, ButtonInteraction } from "discord.js";
import MiauInteraction from "./interaction";
import Emoji from "../../enum/emojis";
import client from "../../..";
import { MiauButtonBuildData, MiauButtonDefaultData } from "../../interfaces/button";

/**
 * > ** **
 * ### ¿Qué es esto?
 * Clase de construcción y manejo de botones.
 * 
 * Esta clase no requiere de especificaciones del constructor o similares.
 * > ** **
 * ### Utilización
 * Si creas un botón y quieres que el cliente lo detecte, recuerda
 * exportarlo como default en el archivo, y asegúrate de que el
 * fichero se encuentra en algún subdirectorio de la carpeta matriz de
 * interacciones.
 * > ** **
 * ### Ejemplo archivo de declaración
 * ```ts
 * // src/interactions/buttons/test.ts
 * const exampleButton = new MiauButton({
 *     name: 'Test button',
 *     customId: 'test',
 *     emoji: '⚠️',
 *     style: ButtonStyle.Primary,
 *     label: 'Test',
 *     isRestricted: false
 * })
 * 
 * exampleButton.setExecution(async (interaction, params) => {
 *     interaction.reply({content:'Botón presionado', ephemeral: true})
 * })
 * 
 * export default exampleButton
 * ```
 * > ** **
 * ### Ejemplo construcción del botón
 * ```ts
 * // src/inetractions/slashCommands/test.js
 * 
 * // ...
 * 
 * const exampleButton = client.interactions.buttons.get('test').build({})
 * interaction.reply({content: 'Botón de ejemplo', components: [exampleButton]})
 * 
 * // ...
 * ```
 */
export default class MiauButton extends MiauInteraction {
    data: MiauButtonDefaultData

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Este es el constructor del botón. En él, indicarás los datos necesarios
     * para poder crearlo y manejarlo.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * const exampleButton = new MiauButton({
     *     name: 'Test button',
     *     customId: 'test',
     *     emoji: '⚠️',
     *     style: ButtonStyle.Primary,
     *     label: 'Test',
     *     isRestricted: false
     * })
     * ```
     * > ** **
     * ### ⚠️ ¡¡Cuidado!!
     * Un botón no puede contener en su id el símbolo `_`
     */
    constructor(data: MiauButtonDefaultData) {
        super();
        if (data.customId.includes("_")) throw new Error('La ID del botón no puede contener el símbolo \'_\'')
        this.data = data;
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Mensaje que se utiliza por defecto para indicar que el usuario no
     * tiene los permisos apropiados para utilizar el botón.
     */
    override noPermissionMenssage: string = Emoji.ERROR + "No tienes permisos para utilizar este botón."

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función que construye y devuelve el botón completamente listo
     * para ser enviado.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * const button_enabled = exampleButton.build({})
     * const button_disabled = exampleButton.build({disabled: true, customEmoji: '🔒'})
     * 
     * context.reply({
     *     content: 'Muestra de un botón habilitado y otro deshabilitado:',
     *     components: [button_enabled, button_disabled]
     * })
     * ```
     */
    build(buildData?: MiauButtonBuildData): ButtonBuilder {
        try {
            var id = this.data.customId

            try {
                buildData?.params?.forEach(param => {
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

            client.utils.console.log(['buttonBuildLog'], `Botón construido con ${buildData?.params?.length ?? 0} parámetros.`);

            try {
                let emoji = buildData?.customEmoji ?? this.data.emoji ?? undefined
                const builder = new ButtonBuilder()
                    .setCustomId(id)
                    .setStyle(this.data.style)
                    .setDisabled(buildData?.disabled ?? false)
                    .setLabel(buildData?.customLabel ?? this.data.label ?? "");

                if (emoji) builder.setEmoji(emoji)

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

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función de ejecución.
     * 
     * Intenta no modificarla de forma directa, utiliza `setExecution`.
     */
    override async execution(context: ButtonInteraction): Promise<any> {
        await context.reply({ content: "¡Qué bien, el botón funciona!\nPero... Mi programador no me ha dicho qué tengo que hacer ahora...", ephemeral: true });
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Método para sobrescribir `execution` con una nueva función.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * exampleButton.setExecution(async (interaction, params) => {
     *     await interaction.reply({content: 'Botón presionado'})
     * })
     * ```
     */
    override setExecution(f: (context: ButtonInteraction) => Promise<any>): this {
        this.execution = f;
        return this
    }
}