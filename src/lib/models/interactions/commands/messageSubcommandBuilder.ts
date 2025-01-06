import { Message } from "discord.js"
import { MiauMessageCommandParam, MiauMessageCommandParamResponse } from "../../../interfaces/messageCommand"
import { ProtectedCollection } from "../../collection"

class MiauMessageSubcommandBuilder {
    constructor() { }

    execution(message: Message, params: ProtectedCollection<MiauMessageCommandParamResponse>): void {

    }

    params: MiauMessageCommandParam[] = []
    name: string | undefined = undefined
    description: string | undefined = undefined

    setName(name: string):this {
        this.name = name
        return this
    }

    setDescription(description: string): this {
        this.description = description
        return this
    }

    setExecution(f: (message: Message, params: ProtectedCollection<MiauMessageCommandParamResponse>) => void): this {
        this.execution = f
        return this
    }

    addParam(param: MiauMessageCommandParam): this {
        this.params.push(param)
        return this
    }
}

export default MiauMessageSubcommandBuilder