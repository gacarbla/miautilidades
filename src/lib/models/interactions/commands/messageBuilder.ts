import { Message } from "discord.js"
import { MiauMessageCommandParam } from "../../../interfaces/messageCommand"
import MiauMessageSubcommandBuilder from "./messageSubcommandBuilder"
import MiauMessageSubcommandgroupBuilder from "./messageSubcommandgroupBuilder"

class MiauMessageCommandBuilder {
    constructor() { }

    protected params: MiauMessageCommandParam[] = []
    protected subcommands: MiauMessageSubcommandBuilder[] = []
    protected subcommandgroups: MiauMessageSubcommandgroupBuilder[] = []

    protected addParam(param: MiauMessageCommandParam): this {
        this.params.push(param)
        return this
    }

    protected execution(message: Message): void {

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

    addSubcommandgroup(g: (subcommand: MiauMessageSubcommandgroupBuilder) => MiauMessageSubcommandgroupBuilder): this {
        const subcommandgroup = new MiauMessageSubcommandgroupBuilder()
        this.subcommandgroups.push(g(subcommandgroup))
        return this
    }
}

export default MiauMessageCommandBuilder