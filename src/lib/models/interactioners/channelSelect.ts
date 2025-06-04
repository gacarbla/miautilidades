import { ChannelSelectMenuInteraction, ComponentType } from "discord.js";
import MiauSelect from "./select";
import { MiauChannelSelectDefaultData } from "../../interfaces/select";
import { ProtectedCollection } from "../collection";

/**
 * > ** **
 * ### ¿Qué es esto?
 * Clase de construcción y manejo de menús de selección de canales.
 * > ** **
 * ### Utilización
 * Si creas una lista y quieres que el cliente la detecte,
 * recuerda exportarla como default en el archivo, y asegúrate
 * de que el fichero se encuentra en algún subdirectorio de la
 * carpeta matriz de interacciones.
 * > ** **
 * ### Ejemplo de declaración
 * ```ts
 * // src/interactions/selects/test.ts
 * 
 * const exampleSelect = new MiauChannelSelect({
 *     name: 'Select de pruebas',
 *     customId: 'test',
 *     label: 'Test',
 *     isRestricted: false
 * })
 * 
 * exampleSelect.setExecution(async (interaction, params) => {
 *     await interaction.reply({content: 'Se ha detectado la selección en el desplegable'})
 * })
 * 
 * export default exampleSelect
 * ```
 * > ** **
 * ### Ejemplo construcción
 * ```ts
 * // src/inetractions/slashCommands/test.js
 * 
 * // ...
 * 
 * const exampleButton = client.interactions.channelSelects.get('test').build({})
 * interaction.reply({content: 'Select menu de ejemplo', components: [exampleButton]})
 * 
 * // ...
 * ```
 */
export default class MiauChannelSelect extends MiauSelect {
    /**
     * > ** **
     * ### ¿Qué es esto?
     * Este es el constructor del select. En él, se indican los datos
     * necesarios para poder crearlo y manejarlo.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * const exampleSelect = new MiauChannelSelect({
     *     name: 'Select de pruebas',
     *     customId: 'test',
     *     label: 'Test',
     *     isRestricted: false
     * })
     * ```
     */
    constructor(data: Omit<MiauChannelSelectDefaultData, 'type'>) {
        super({...data, type: ComponentType.ChannelSelect});
    }

    override async execution(context: ChannelSelectMenuInteraction, _: ProtectedCollection<string|number>): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica.", ephemeral: true });
    }

    override setExecution(f: (context: ChannelSelectMenuInteraction, params: ProtectedCollection<string|number>) => Promise<void>): this {
        this.execution = f;
        return this
    }
}