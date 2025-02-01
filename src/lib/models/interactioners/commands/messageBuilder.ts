import { Message } from "discord.js"
import { MiauMessageCommandParam, MiauMessageCommandParamResponse } from "../../../interfaces/messageCommand"
import MiauMessageSubcommandBuilder from "./messageSubcommandBuilder"
import MiauMessageSubcommandgroupBuilder from "./messageSubcommandgroupBuilder"
import { ProtectedCollection } from "../../collection"

/**
 * > ** **
 * ### ¿Qué es esto?
 * Clase de construcción de comandos Message
 * 
 * **No se recomienda su uso fuera del constructor de comandos Message.**
 */
class MiauMessageCommandBuilder {
    constructor() { }

    params: MiauMessageCommandParam[] = []
    subcommands: MiauMessageSubcommandBuilder[] = []
    subcommandgroups: MiauMessageSubcommandgroupBuilder[] = []

    // TODO: Permitir añadir precondiciones al comando.

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función para añadir parámetros al comando base.
     * 
     * Los parámetros son campos que el usuario debe introducir de forma obligatoria para que el comando funcione.
     * 
     * En el siguiente ejemplo, los parámetros serán `-channel` o `--c` y `-status` o `--s`
     * 
     * ```txt
     * gw!podcast -channel #oyentes -status active
     * gw!podcast --c #oyentes --s active
     * ```
     */
    addParam(param: MiauMessageCommandParam): this {
        // TODO: Verificar que el parámetro es correcto.
        this.params.push(param)
        return this
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función de ejecución.
     * 
     * Se recomienda no alterarla manualmente. Utiliza la función `setExecution`.
     */
    execution(message: Message, params: ProtectedCollection<MiauMessageCommandParamResponse>): void {
        message.reply({content: '¡Mensaje leído!\nPero... No sé qué debo hacer...'})
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función que establece la ejecución designada al comando.
     */
    setExecution(f: (message: Message, params: ProtectedCollection<MiauMessageCommandParamResponse>) => void): this {
        // TODO: Verificar que la función es correcta.
        this.execution = f
        return this
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * 
     */
    addSubcommand(s: (subcommand: MiauMessageSubcommandBuilder) => MiauMessageSubcommandBuilder): this {
        const subcommand = new MiauMessageSubcommandBuilder()
        // TODO: Antes de añadir el subcomando, verificar que es correcto.
        this.subcommands.push(s(subcommand))
        return this
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * 
     */
    addSubcommandgroup(g: (subcommand: MiauMessageSubcommandgroupBuilder) => MiauMessageSubcommandgroupBuilder): this {
        const subcommandgroup = new MiauMessageSubcommandgroupBuilder()
        // TODO: Antes de añadir el grupo, verificar que es correcto.
        this.subcommandgroups.push(g(subcommandgroup))
        return this
    }

    // TODO: Añadir función `test` que permita comprobar si el comando cumple los requisitos para ser válido.
}

export default MiauMessageCommandBuilder