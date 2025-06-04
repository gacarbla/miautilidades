import client from "../../../.."
import { interactionNameRegEx } from "../../../constants/discord"
import { MiauSlashCommandDefaultData, MiauSlashCommandParam } from "../../../interfaces/interaction"
import Preconditions from "../../preconditions"
import MiauSlashSubcommandBuilder from "./slashSubcommandBuilder"
import MiauSlashSubcommandgroupBuilder from "./slashSubcommandgroupBuilder"

class MiauSlashCommandBuilder {

    params: MiauSlashCommandParam[] = []
    subcommands: MiauSlashSubcommandBuilder[] = []
    subcommandgroups: MiauSlashSubcommandgroupBuilder[] = []

    private preconditions: Preconditions[] = [];

    addPreconditions(...preconditions: Preconditions[]): this {
        this.preconditions.push(...preconditions);
        return this;
    }

    getPreconditions(): Preconditions[] {
        return this.preconditions;
    }

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

    addParam(param: MiauSlashCommandParam): this {
        if (this.subcommands.length > 0) throw new Error("No se puede asignar un parámetro a un comando con subcomandos.")
        if (this.subcommandgroups.length > 0) throw new Error("No se puede asignar un parámetro a un comando con grupos de subcomandos.")
        if (!client.utils.Interactions.verify.param.slash(param)) throw new Error("Parámetro con estructura incorrecta.")
        this.params.push(param)
        return this
    }

    test(data: MiauSlashCommandDefaultData): boolean {
        const nameOk =
            typeof data.name === 'string' &&
            interactionNameRegEx.test(data.name) &&
            data.name.length >= 1 &&
            data.name.length <= 32;

        const descOk =
            typeof data.description === 'string' &&
            data.description.length >= 1 &&
            data.description.length <= 100;

        const hasSubcommands = this.subcommands.length > 0;
        const hasGroups = this.subcommandgroups.length > 0;
        const hasParams = this.params.length > 0;

        const oneTypeOnly =
            [hasSubcommands, hasGroups, hasParams].filter(Boolean).length === 1;

        const allSubsValid = this.subcommands.every(s => s.test());
        const allGroupsValid = this.subcommandgroups.every(g => g.test());
        const allParamsValid = this.params.every(p => client.utils.Interactions.verify.param.slash(p));

        return nameOk && descOk && oneTypeOnly && allSubsValid && allGroupsValid && allParamsValid;
    }

    toJSON(data: MiauSlashCommandDefaultData) {
        if (!this.test(data)) {
            throw new Error("El comando no es válido.");
        }

        return {
            name: data.name.toLowerCase(),
            description: data.description,
            options: this.subcommands.length > 0
                ? this.subcommands.map(s => s.toJSON())
                : this.subcommandgroups.length > 0
                    ? this.subcommandgroups.map(g => g.toJSON())
                    : this.params.map(p => ({
                        type: p.type,
                        name: p.customId,
                        description: p.description,
                        required: p.required ?? false,
                        choices: p.choices ?? undefined
                    }))
        };
    }

    exportHelp(data: MiauSlashCommandDefaultData): any {
        return {
            name: data.name,
            description: data.description,
            type: this.subcommands.length > 0 ? 'subcommands' :
                this.subcommandgroups.length > 0 ? 'groups' : 'params',
            content:
                this.subcommands.length > 0 ? this.subcommands.map(s => s.exportHelp()) :
                    this.subcommandgroups.length > 0 ? this.subcommandgroups.map(g => g.exportHelp()) :
                        this.params.map(p => `${p.customId}${p.required ? '*' : ''}`)
        };
    }

}

export default MiauSlashCommandBuilder