import { MiauSlashCommandParam } from "../../../interfaces/interaction"
import MiauSlashSubcommandBuilder from "./slashSubcommandBuilder"
import MiauSlashSubcommandgroupBuilder from "./slashSubcommandgroupBuilder"

class MiauSlashCommandBuilder {

    params: MiauSlashCommandParam[] = []
    subcommands:MiauSlashSubcommandBuilder[] = []
    subcommandgroups:MiauSlashSubcommandgroupBuilder[] = []

    addSubcommand(s: (subcommand: MiauSlashSubcommandBuilder) => MiauSlashSubcommandBuilder): this {
        const subcommand = new MiauSlashSubcommandBuilder()
        this.subcommands.push(s(subcommand))
        return this
    }

    addSubcommandgroup(g: (subcommand: MiauSlashSubcommandgroupBuilder) => MiauSlashSubcommandgroupBuilder): this {
        const subcommandgroup = new MiauSlashSubcommandgroupBuilder()
        this.subcommandgroups.push(g(subcommandgroup))
        return this
    }

    addParam(param:MiauSlashCommandParam):this {
            this.params.push(param)
            return this
        }

    toJSON(name:string, description:string) {
        return {
            name: name,
            description: description,
            subcommands: this.subcommands.map(s => s.toJSON()),
            subcommandgroups: this.subcommandgroups.map(s => s.toJSON()),
        }
    }
}

export default MiauSlashCommandBuilder