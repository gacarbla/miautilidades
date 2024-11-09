import { Message } from "discord.js"
import { MiauMessageCommandParam } from "../../../interfaces/messageCommand"

class MiauMessageSubcommandBuilder {
    constructor() { }

    execution(message: Message): void {

    }

    params: MiauMessageCommandParam[] = []
    name: string | undefined = undefined
    description: string | undefined = undefined

    setName(name: string) {
        this.name = name
        return this
    }

    setDescription(description: string) {
        this.description = description
        return this
    }

    setExecution(f: (message: Message) => void): this {
        this.execution = f
        return this
    }

    addParam(param: MiauMessageCommandParam): this {
        this.params.push(param)
        return this
    }
}

export default MiauMessageSubcommandBuilder