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
        this.subcommandgroups.push(g(subcommandgroup))
        return this
    }
}

export default MiauMessageCommandBuilder