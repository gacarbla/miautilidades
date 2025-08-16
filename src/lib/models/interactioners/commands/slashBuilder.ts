import client from "../../../.."
import { interactionNameRegEx } from "../../../constants/discord"
import { SlashParamTypes } from "../../../enum/interactions"
import { MiauSlashCommandDefaultData, MiauSlashCommandParam } from "../../../interfaces/interaction"
import { ParamsFrom } from "../../../types/slashCommands"
import Preconditions from "../../preconditions"
import MiauSlashSubcommandBuilder from "./slashSubcommandBuilder"
import MiauSlashSubcommandgroupBuilder from "./slashSubcommandgroupBuilder"
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js"

export class MiauSlashCommandBuilder<
    TParams extends Record<string, MiauSlashCommandParam> = {}
> {

    constructor(init?: {
        params?: TParams;
        subcommands?: any[];
        subcommandgroups?: any[];
        preconditions?: any[];
    }) {
        if (init?.params) this.params = init.params;
        if (init?.subcommands) this.subcommands = init.subcommands;
        if (init?.subcommandgroups) this.subcommandgroups = init.subcommandgroups;
        if (init?.preconditions) this.preconditions = init.preconditions;
    }

    private params: TParams = {} as TParams;
    subcommands: any[] = [];
    subcommandgroups: any[] = [];
    private preconditions: any[] = [];

    private toDiscordOptionType(t: MiauSlashCommandParam["type"]): ApplicationCommandOptionType {
        if (typeof t === "string") {
            switch (t) {
                case "LETTER":
                case "WORD":
                case "TEXT": return ApplicationCommandOptionType.String;
                case "NUMBER": return ApplicationCommandOptionType.Number;
                case "INTEGER": return ApplicationCommandOptionType.Integer;
                case "BOOLEAN": return ApplicationCommandOptionType.Boolean;
                case "USER":
                case "MEMBER": return ApplicationCommandOptionType.User; // MEMBER se resuelve como USER
                case "ROLE": return ApplicationCommandOptionType.Role;
                case "CHANNEL": return ApplicationCommandOptionType.Channel;
                case "MENTIONABLE": return ApplicationCommandOptionType.Mentionable;
                case "ATTACHMENT": return ApplicationCommandOptionType.Attachment;
                default: throw new Error(`Tipo de slash no soportado: ${String(t)}`);
            }
        }
        switch (t) {
            case SlashParamTypes.LETTER:
            case SlashParamTypes.WORD:
            case SlashParamTypes.TEXT: return ApplicationCommandOptionType.String;
            case SlashParamTypes.NUMBER: return ApplicationCommandOptionType.Number;
            case SlashParamTypes.INTEGER: return ApplicationCommandOptionType.Integer;
            case SlashParamTypes.BOOLEAN: return ApplicationCommandOptionType.Boolean;
            case SlashParamTypes.USER:
            case SlashParamTypes.MEMBER: return ApplicationCommandOptionType.User;
            case SlashParamTypes.ROLE: return ApplicationCommandOptionType.Role;
            case SlashParamTypes.CHANNEL: return ApplicationCommandOptionType.Channel;
            case SlashParamTypes.MENTIONABLE: return ApplicationCommandOptionType.Mentionable;
            case SlashParamTypes.ATTACHMENT: return ApplicationCommandOptionType.Attachment;
            default: throw new Error(`Tipo de slash (enum) no soportado: ${String(t)}`);
        }
    }

    private isTextType(t: MiauSlashCommandParam["type"]): boolean {
        return typeof t === "string"
            ? t === "LETTER" || t === "WORD" || t === "TEXT"
            : t === SlashParamTypes.LETTER || t === SlashParamTypes.WORD || t === SlashParamTypes.TEXT;
    }

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

    addParam<
        const P extends MiauSlashCommandParam & { customId: string }
    >(param: P): MiauSlashCommandBuilder<TParams & { [K in P["customId"]]: P }> {
        if (this.subcommands.length > 0) throw new Error("No se puede asignar un parámetro a un comando con subcomandos.");
        if (this.subcommandgroups.length > 0) throw new Error("No se puede asignar un parámetro a un comando con grupos de subcomandos.");
        if (!client.utils.Interactions.verify.param.slash(param)) throw new Error("Parámetro con estructura incorrecta.");

        const key = param.customId as P["customId"];

        if ((this.params as Record<string, unknown>)[key as string]) {
            throw new Error(`Ya existe un parámetro con customId '${key as string}'.`);
        }

        const nextParams = {
            ...(this.params as Record<string, MiauSlashCommandParam>),
            [key]: param
        } as TParams & { [K in P["customId"]]: P };

        return new MiauSlashCommandBuilder<TParams & { [K in P["customId"]]: P }>({
            params: nextParams,
            subcommands: this.subcommands,
            subcommandgroups: this.subcommandgroups,
            preconditions: this.preconditions
        } as any);
    }

    getParams(): TParams {
        return this.params;
    }

    getParamsArray(): MiauSlashCommandParam[] {
        return Object.values(this.params);
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
        const hasParams = Object.keys(this.params).length > 0;

        const oneTypeOnly =
            [hasSubcommands, hasGroups, hasParams].filter(Boolean).length <= 1;

        const allSubsValid = this.subcommands.every(s => s.test());
        const allGroupsValid = this.subcommandgroups.every(g => g.test());
        const allParamsValid = Object.values(this.params).every(p =>
            client.utils.Interactions.verify.param.slash(p)
        );

        return nameOk && descOk && oneTypeOnly && allSubsValid && allGroupsValid && allParamsValid;
    }

    toJSON(data: MiauSlashCommandDefaultData) {
        if (!this.test(data)) throw new Error("El comando no es válido.");

        const options =
            this.subcommands.length > 0
                ? this.subcommands.map(s => s.toJSON())
                : this.subcommandgroups.length > 0
                    ? this.subcommandgroups.map(g => g.toJSON())
                    : this.paramsToOptionsJSON();

        return {
            name: data.name.toLowerCase(),
            description: data.description,
            options
        };
    }

    private paramsToOptionsJSON() {
        const arr = Object.values(this.params);

        const ordered = [...arr.filter(p => p.required), ...arr.filter(p => !p.required)];

        return ordered.map((param) => {
            const optionType = this.toDiscordOptionType(param.type);
            const base: any = {
                type: optionType,
                name: String(param.customId).toLowerCase(),
                description: param.description,
                required: param.required ?? false
            };

            if (this.isTextType(param.type) && "choices" in param && Array.isArray((param as any).choices)) {
                base.choices = (param as any).choices;
            }

            if ("min_value" in param) base.min_value = (param as any).min_value;
            if ("max_value" in param) base.max_value = (param as any).max_value;
            if ("min_length" in param) base.min_length = (param as any).min_length;
            if ("max_length" in param) base.max_length = (param as any).max_length;
            if ("channel_types" in param) base.channel_types = (param as any).channel_types;
            if ("autocomplete" in param) base.autocomplete = (param as any).autocomplete;

            return base;
        });
    }

    exportHelp(data: MiauSlashCommandDefaultData): any {
        return {
            name: data.name,
            description: data.description,
            type: this.subcommands.length > 0 ? 'subcommands' :
                this.subcommandgroups.length > 0 ? 'groups' : 'command',
            content:
                this.subcommands.length > 0 ? this.subcommands.map(s => s.exportHelp()) :
                    this.subcommandgroups.length > 0 ? this.subcommandgroups.map(g => g.exportHelp()) :
                        Object.values(this.params).map(p => `${p.customId}${p.required ? '*' : ''}`)
        };
    }

    async execution(
        interaction: ChatInputCommandInteraction,
        params: ParamsFrom<TParams>
    ): Promise<any> {
        try {
            void params
            if (!interaction.deferred && !interaction.replied) {
                await interaction.reply({
                    content: "⚠️ Este comando no tiene una ejecución definida.",
                    ephemeral: true
                });
            }
        } catch { }
    }

    setExecution(
        f: (interaction: ChatInputCommandInteraction, params: ParamsFrom<TParams>) => Promise<any>
    ): this {
        if (typeof f !== "function") {
            throw new TypeError("setExecution requiere una función asíncrona válida.");
        }
        this.execution = f;
        return this;
    }
}

export default MiauSlashCommandBuilder
