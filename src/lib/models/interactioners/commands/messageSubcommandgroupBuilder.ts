import { Message } from "discord.js"
import { MiauMessageCommandParam, MiauMessageCommandParamResponse } from "../../../interfaces/messageCommand"
import MiauMessageSubcommandBuilder from "./messageSubcommandBuilder"
import { ProtectedCollection } from "../../collection"

class MiauMessageSubcommandgroupBuilder {
    constructor() { }
    async execution(message: Message, _: ProtectedCollection<MiauMessageCommandParamResponse>): Promise<void> {
        await message.reply('¡Hola! No tengo ni idea de qué se supone que debo hacer :D')
    }

    // TODO: Permitir añadir precondiciones al grupo de subcomandos.

    params: MiauMessageCommandParam[] = []
    subcommands: MiauMessageSubcommandBuilder[] = []
    name: string | undefined = undefined
    description: string | undefined = undefined

    setName(name: string) {
        // TODO: Verificar formato y extensión del nombre.
        this.name = name
        return this
    }

    setDescription(description: string) {
        // TODO: Verificar que la descripción está compuesta por los caracteres permitidos.
        this.description = description
        return this
    }

    setExecution(f: (message: Message, params: ProtectedCollection<MiauMessageCommandParamResponse>) => Promise<void>): this {
        // TODO: Verificar que la función es correcta.
        this.execution = f
        return this
    }

    addSubcommand(s: (subcommand: MiauMessageSubcommandBuilder) => MiauMessageSubcommandBuilder): this {
        const subcommand = new MiauMessageSubcommandBuilder()
        // TODO: Antes de añadir el subcomando, verificar que es correcto.
        this.subcommands.push(s(subcommand))
        return this
    }

    addParam(param: MiauMessageCommandParam): this {
        // TODO: Verificar que el parámetro es correcto
        this.params.push(param)
        return this
    }

    // TODO: Permitir exportar para comando help
}

export default MiauMessageSubcommandgroupBuilder