import { AnySelectMenuInteraction, ChannelSelectMenuBuilder, ComponentType, MentionableSelectMenuBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder } from "discord.js";
import MiauInteraction from "./interaction";
import { MiauSelectBuildData, MiauSelectDefaultData } from "../../interfaces/select";
import { ProtectedCollection } from "../collection";

type AnySelectMenuBuilder = StringSelectMenuBuilder | UserSelectMenuBuilder | RoleSelectMenuBuilder | MentionableSelectMenuBuilder | ChannelSelectMenuBuilder

/**
 * > ** **
 * ### ¿Qué es esto?
 * Clase de construcción y manejo de menús de selección.
 * 
 * NO SE RECOMIENDA SU USO. EXISTEN CONSTRUCTORES
 * ADECUADOS PARA CADA UNO DE LOS TIPOS.
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
 * const exampleSelect = new MiauSelect({
 *     name: 'Select de pruebas',
 *     customId: 'test',
 *     label: 'Test',
 *     type: ComponentType.ChannelSelect,
 *     isRestricted: false
 * })
 * 
 * exampleSelect.setExecution(async (interaction, params) => {
 *     await interaction.reply({content: 'Se ha detectado la selección en el desplegable'})
 * })
 * 
 * export default exampleSelect
 * 
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
export default class MiauSelect extends MiauInteraction {
    protected data:MiauSelectDefaultData

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Este es el constructor del select. En él, indicaremos los datos
     * necesarios para poder crearlo y manejarlo.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * const exampleSelect = new MiauSelect({
     *     name: 'Select de pruebas',
     *     customId: 'test',
     *     label: 'Test',
     *     type: ComponentType.ChannelSelect,
     *     isRestricted: false
     * })
     * ```
     */
    constructor(data: MiauSelectDefaultData) {
        super();
        this.data = data;
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función de ejecución.
     * 
     * Intenta no modificarla de forma directa, utiliza `setExecution`.
     */
    override async execution(context: AnySelectMenuInteraction, _: ProtectedCollection<string|number>): Promise<void> {
        await context.reply({ content: "Select Menu respondido, pero no se ha definido acción específica.", ephemeral: true });
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función que construye y devuelve el select menu completamente
     * listo para ser enviado.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * const normal_select = exampleSelect.build({})
     * const disabled_select = exampleSelect.build({ disabled: true })
     * 
     * context.reply({components: [normal_select, disabled_select]})
     * ```
     */
    build(data: MiauSelectBuildData) {
        var select:AnySelectMenuBuilder|undefined
        switch (this.data.type) {
            case ComponentType.StringSelect:
                select = new StringSelectMenuBuilder()
                    .setOptions(this.data.options??[])
                break
            case ComponentType.UserSelect:
                select = new UserSelectMenuBuilder()
                break
            case ComponentType.RoleSelect:
                select = new RoleSelectMenuBuilder()
                break
            case ComponentType.MentionableSelect:
                select = new MentionableSelectMenuBuilder()
                break
            case ComponentType.ChannelSelect:
                select = new ChannelSelectMenuBuilder()
        }
        let id = this.data.customId;
        try {
            data.params?.forEach(param => {
                if (param.includes("_")) throw new Error("Los parámetros de botones no pueden incluir el símbolo '_'");
                id += `_${param}`;
            });
            if (id.length > 100) {
                throw new Error(`La ID del select excede los 100 caracteres permitidos: ${id}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al crear la ID del select";
            throw new Error(errorMessage);
        }
        select
            .setCustomId(id)
            .setDisabled(data.disabled ?? false)
            .setPlaceholder(data.customLabel ?? this.data.label)
        if (this.data.maxOptions) select.setMaxValues(this.data.maxOptions)
        if (this.data.minOptions) select.setMinValues(this.data.minOptions)
        return select
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Método para sobrescribir `execution` con una nueva función.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * exampleSelect.setExecution(async (interaction, params) => {
     *     await interaction.reply({content: 'Selección entregada'})
     * })
     * ```
     */
    override setExecution(f: (context: AnySelectMenuInteraction, params: ProtectedCollection<string|number>) => Promise<void>): this {
        this.execution = f;
        return this
    }
}