import { Message } from "discord.js";
import Emoji from "../../enum/emojis";
import MiauInteraction from "./interaction";
import MiauMessageCommandBuilder from "./commands/messageBuilder";
import { MiauMessageCommandDefaultData } from "../../interfaces/messageCommand";

/**
 * > ** **
 * ### ¿Qué es esto?
 * Clase de construcción y manejo de comandos de mensaje.
 * 
 * Esta es una de las clases más complicadas por su variabilidad de
 * funcionamiento dependiendo de subcomandos, argumentos y otros.
 * > ** **
 * ### Utilización
 * Si creas un comando y quieres que el cliente lo detecte, recuerda
 * exportar el comando como default en el archivo, y asegúrate de que el
 * fichero se encuentra en algún subdirectorio de la carpeta matriz de
 * interacciones.
 * > ** **
 * ### Ejemplo de uso
 * ```ts
 * const exampleCommand = new MiauMessageCommand()
 * ```
 */
export default class MiauMessageCommand extends MiauInteraction {
    private data: MiauMessageCommandDefaultData

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Mensaje que se utiliza por defecto para indicar que el usuario no
     * tiene los permisos apropiados para utilizar el comando.
     */
    override noPermissionMenssage: string = Emoji.ERROR + "No tienes permisos para ejecutar este comando";

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Este es el constructor del comando.
     * 
     * Gracias a él podrás iniciar con la configuración base de tu comando,
     * pero para ejecución, configuración u otros, necesitarás métodos más
     * avanzados. En el caso de los comandos Message y Slash se utiliza el
     * elemento `build`.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * const exampleCommand = new MiauMessageCommand({
     *     name: 'prueba',
     *     alias: ['test'],
     *     description: 'Comando de prueba',
     *     isRestricted: false
     * })
     * ```
     */
    constructor(data: MiauMessageCommandDefaultData) {
        super()
        this.data = data
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Este es el elemento que se encarga de la declaración de cómo se construye
     * el comando, y con ello, qué funciones se asocian a cada uno de los
     * subcomandos o grupos.
     * > ** **
     * ### Ejemplos de uso
     * ```ts
     * exampleCommand.build
     *     .addSubcommand((subcommand) =>
     *         subcommand
     *             .setName('subcomando')
     *             .setDescription('Subcomando de ejemplo')
     *             .addParam({
     *                 customId: 'param',
     *                 description: 'Parámetro de ejemplo',
     *                 required: true,
     *                 type: 'text',
     *                 max_len: 32,
     *                 min_len: 8
     *             })
     *             .setExecution((message, params) => {
     *                 let texto = params.get('param')
     *                 message.reply(`Texto indicado: \`${texto}\``)
     *             })
     *     )
     * ```
     */
    builder:MiauMessageCommandBuilder = new MiauMessageCommandBuilder()

    toJSON():Object {
        return this.builder.toJSON(this.data)
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Esta es la función que define la ejecución del comando.
     * 
     * Se recomienda encarecidamente **NO** modificarla ni declararla siquiera en
     * el código. Por favor, intenta utilizar el valor por defecto.
     */
    override async execution(context: Message): Promise<void> {
        await context.reply({content: '¡Dato curioso!\n¿Sabías que ves este mensaje porque mi desarrollador no ha terminado de programarme y es un perezoso al que le lleva 2 meses hacer un handler?'})
    }

    /**
     * ¡Esto no es posible en este método!
     * 
     * La ejecución se establece en el constructor del comando.
     */
    override setExecution: undefined;
}