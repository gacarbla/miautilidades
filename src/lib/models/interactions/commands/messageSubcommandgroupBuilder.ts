import { Message } from "discord.js"
import { MiauMessageCommandParam } from "../../../interfaces/messageCommand"
import MiauMessageSubcommandBuilder from "./messageSubcommandBuilder"

class MiauMessageSubcommandgroupBuilder {
    constructor() { }
    execution(message: Message): void {

    }

    params: MiauMessageCommandParam[] = []
    subcommands: MiauMessageSubcommandBuilder[] = []
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

    addSubcommand(s: (subcommand: MiauMessageSubcommandBuilder) => MiauMessageSubcommandBuilder): this {
        const subcommand = new MiauMessageSubcommandBuilder()
        this.subcommands.push(s(subcommand))
        return this
    }

    addParam(param: MiauMessageCommandParam): this {
        this.params.push(param)
        return this
    }
}

export default MiauMessageSubcommandgroupBuilder