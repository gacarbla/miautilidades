import client from "../../../.."
import { MiauSlashCommandDefaultData, MiauSlashCommandParam } from "../../../interfaces/interaction"
import MiauSlashSubcommandBuilder from "./slashSubcommandBuilder"
import MiauSlashSubcommandgroupBuilder from "./slashSubcommandgroupBuilder"

class MiauSlashCommandBuilder {

    params: MiauSlashCommandParam[] = []
    subcommands:MiauSlashSubcommandBuilder[] = []
    subcommandgroups:MiauSlashSubcommandgroupBuilder[] = []

    // TODO: Añadir posibilidad de añadir precondiciones al comando.

    addSubcommand(s: (subcommand: MiauSlashSubcommandBuilder) => MiauSlashSubcommandBuilder): this {
        const subcommand = new MiauSlashSubcommandBuilder()
        const apply = s(subcommand)
        if (!apply.test()) throw new Error("El subcomando parece estar mal declarado.")
        if (this.subcommands.length >= 25) throw new Error("Este comando ya tiene 25 subcomandos.")
        if (this.subcommandgroups.length > 0) throw new Error("No se puede asignar un subcomando a un comando con grupos de subcomandos.")
        this.subcommands.push(apply)
        return this
    }

    addSubcommandgroup(g: (subcommandgroup: MiauSlashSubcommandgroupBuilder) => MiauSlashSubcommandgroupBuilder): this {
        const subcommandgroup = new MiauSlashSubcommandgroupBuilder()
        const apply = g(subcommandgroup)
        if (!apply.test()) throw new Error("El grupo de subcomandos parece estar mal declarado.")
        if (this.subcommandgroups.length >= 25) throw new Error("Este comando ya tiene 25 grupos.")
        if (this.subcommands.length > 0) throw new Error("No se puede asignar un grupo a un comando con subcomandos.")
        this.subcommandgroups.push(apply)
        return this
    }

    addParam(param:MiauSlashCommandParam):this {
        if (this.subcommands.length > 0) throw new Error("No se puede asignar un parámetro a un comando con subcomandos.")
        if (this.subcommandgroups.length > 0) throw new Error("No se puede asignar un parámetro a un comando con grupos de subcomandos.")
        if (!client.utils.Interactions.verify.param.slash(param)) throw new Error("Parámetro con estructura incorrecta.")
        this.params.push(param)
        return this
    }

    // TODO: Añadir función `test` que verifique que el comando es válido.

    toJSON(data:MiauSlashCommandDefaultData) {
        // TODO: Añadir verificación con función `test` para certificar que el comando es válido antes de exportarlo.
        return {
            name: data.name,
            description: data.description,
            subcommands: this.subcommands.map(s => s.toJSON()),
            subcommandgroups: this.subcommandgroups.map(s => s.toJSON()),
        }
    }

    // TODO: Permitir exportar para comando help
}

export default MiauSlashCommandBuilder