import { ChatInputCommandInteraction } from "discord.js";
import { ProtectedCollection } from "../../collection";
import { MiauSlashCommandParam } from "../../../interfaces/interaction";

class MiauSlashSubcommandBuilder {
    constructor() { }

    execution(interaction:ChatInputCommandInteraction, params: ProtectedCollection<MiauSlashCommandParam>) {

    }

    params: MiauSlashCommandParam[] = []
    name: string | undefined = undefined
    description: string | undefined = undefined

    setName(name:string):this {
        this.name = name
        return this
    }

    setDescription(description: string):this {
        this.description = description
        return this
    }

    setExecution(f: (interaction: ChatInputCommandInteraction, params: ProtectedCollection<MiauSlashCommandParam>) => void):this {
        this.execution = f
        return this
    }

    addParam(param:MiauSlashCommandParam ):this {
        this.params.push(param)
        return this
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.paramsToOptionsJSON()
        }
    }

    private paramsToOptionsJSON() {

    }
}

export default MiauSlashSubcommandBuilder