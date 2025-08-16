import {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
} from "discord.js";
import { MiauSlashCommandDefaultData, MiauSlashCommandParam } from "../../interfaces/interaction";
import { MiauSlashCommandBuilder } from "./commands";
import MiauInteraction from "./interaction";
import { SlashParamTypes } from "../../enum/interactions";
import Preconditions from "../preconditions";
import client from "../../..";

export default class MiauSlashCommand extends MiauInteraction {
    data: MiauSlashCommandDefaultData;

    constructor(data: MiauSlashCommandDefaultData) {
        super();
        this.data = data;
    }

    toJSON(): object {
        return this.builder.toJSON(this.data);
    }

    // ───────────────────────────────── helpers tipos ─────────────────────────────────

    private toDiscordOptionType(t: MiauSlashCommandParam["type"]): ApplicationCommandOptionType {
        if (typeof t === "string") {
            switch (t) {
                case "LETTER":
                case "WORD":
                case "TEXT":
                    return ApplicationCommandOptionType.String;
                case "NUMBER":
                    return ApplicationCommandOptionType.Number;
                case "INTEGER":
                    return ApplicationCommandOptionType.Integer;
                case "BOOLEAN":
                    return ApplicationCommandOptionType.Boolean;
                case "USER":
                case "MEMBER":
                    return ApplicationCommandOptionType.User;
                case "ROLE":
                    return ApplicationCommandOptionType.Role;
                case "CHANNEL":
                    return ApplicationCommandOptionType.Channel;
                case "MENTIONABLE":
                    return ApplicationCommandOptionType.Mentionable;
                case "ATTACHMENT":
                    return ApplicationCommandOptionType.Attachment;
                default:
                    throw new Error(`Tipo de slash no soportado: ${String(t)}`);
            }
        }
        switch (t) {
            case SlashParamTypes.LETTER:
            case SlashParamTypes.WORD:
            case SlashParamTypes.TEXT:
                return ApplicationCommandOptionType.String;
            case SlashParamTypes.NUMBER:
                return ApplicationCommandOptionType.Number;
            case SlashParamTypes.INTEGER:
                return ApplicationCommandOptionType.Integer;
            case SlashParamTypes.BOOLEAN:
                return ApplicationCommandOptionType.Boolean;
            case SlashParamTypes.USER:
            case SlashParamTypes.MEMBER:
                return ApplicationCommandOptionType.User;
            case SlashParamTypes.ROLE:
                return ApplicationCommandOptionType.Role;
            case SlashParamTypes.CHANNEL:
                return ApplicationCommandOptionType.Channel;
            case SlashParamTypes.MENTIONABLE:
                return ApplicationCommandOptionType.Mentionable;
            case SlashParamTypes.ATTACHMENT:
                return ApplicationCommandOptionType.Attachment;
            default:
                throw new Error(`Tipo de slash (enum) no soportado: ${String(t)}`);
        }
    }

    private isMemberType(t: MiauSlashCommandParam["type"]): boolean {
        return typeof t === "string" ? t === "MEMBER" : t === SlashParamTypes.MEMBER;
    }

    private async runPreconditions(list: Preconditions[] | undefined, ctx: ChatInputCommandInteraction): Promise<void> {
        if (!list?.length) return;
        for (const p of list) {
            const fn = (p as any).run ?? (p as any).execute ?? (p as any).check ?? (p as any).test;
            if (typeof fn === "function") {
                const res = await fn.call(p, ctx);
                if (res === false || (res && res.allowed === false)) {
                    const reason = (res && (res.reason || res.message)) || "No cumples las condiciones para usar este comando.";
                    throw new Error(String(reason));
                }
            }
        }
    }

    /** Resuelve params para un registro { [customId]: param } (comando o sub) */
    private resolveParamsFromRecord(
        interaction: ChatInputCommandInteraction,
        record: Record<string, MiauSlashCommandParam>
    ): Record<string, unknown> {
        const out: Record<string, unknown> = {};
        for (const key of Object.keys(record)) {
            const p = record[key];
            const required = !!p.required;
            const dType = this.toDiscordOptionType(p.type);

            switch (dType) {
                case ApplicationCommandOptionType.String:
                    out[key] = interaction.options.getString(key, required) ?? undefined;
                    break;
                case ApplicationCommandOptionType.Integer:
                    out[key] = interaction.options.getInteger(key, required) ?? undefined;
                    break;
                case ApplicationCommandOptionType.Number:
                    out[key] = interaction.options.getNumber(key, required) ?? undefined;
                    break;
                case ApplicationCommandOptionType.Boolean:
                    out[key] = interaction.options.getBoolean(key, required) ?? undefined;
                    break;
                case ApplicationCommandOptionType.User:
                    if (this.isMemberType(p.type)) {
                        const m = interaction.options.getMember(key); // sin "required"
                        if (required && !m) throw new Error(`Falta el parámetro requerido '${key}' (MEMBER).`);
                        out[key] = m ?? undefined;
                    } else {
                        out[key] = interaction.options.getUser(key, required) ?? undefined;
                    }
                    break;
                case ApplicationCommandOptionType.Role:
                    out[key] = interaction.options.getRole(key, required) ?? undefined;
                    break;
                case ApplicationCommandOptionType.Channel:
                    out[key] = interaction.options.getChannel(key, required) ?? undefined;
                    break;
                case ApplicationCommandOptionType.Mentionable:
                    out[key] = interaction.options.getMentionable(key, required) ?? undefined;
                    break;
                case ApplicationCommandOptionType.Attachment:
                    out[key] = interaction.options.getAttachment(key, required) ?? undefined;
                    break;
                default:
                    this.console.warning(["commandBuildWarn"] as any, `Tipo no soportado: ${String(p.type)} (${key})`);
                    out[key] = undefined;
            }
        }
        return out;
    }

    // ─────────────────────────────── helpers colecciones ───────────────────────────────

    private getName(x: any): string | undefined {
        return x?.name ?? x?.getName?.() ?? x?.data?.name;
    }

    private asArray<T = any>(input: any): T[] {
        if (!input) return [];
        if (Array.isArray(input)) return input as T[];
        if (typeof input[Symbol.iterator] === "function") {
            try { return Array.from(input as Iterable<T>); } catch { /* noop */ }
        }
        if (typeof input.values === "function") {
            try { return Array.from(input.values() as Iterable<T>); } catch { /* noop */ }
        }
        if (typeof input.toArray === "function") {
            try { return input.toArray() as T[]; } catch { /* noop */ }
        }
        if (typeof input === "object") {
            try { return Object.values(input) as T[]; } catch { /* noop */ }
        }
        return [];
    }

    private getGroupByName(groups: any, groupName?: string | null): any | undefined {
        const arr = this.asArray<any>(groups);
        const target = groupName?.toLowerCase();
        return arr.find(g => this.getName(g)?.toLowerCase() === target);
    }

    private getSubFromGroup(group: any, subName?: string): any | undefined {
        if (!subName) return undefined;
        const target = subName.toLowerCase();

        if (typeof group.getSubcommand === "function") {
            const byGetter = group.getSubcommand(target) ?? group.getSubcommand(subName);
            if (byGetter) return byGetter;
        }

        const bag = group.subcommands ?? group.children ?? group.items;

        if (bag?.get) {
            const byKey = bag.get(target) ?? bag.get(subName);
            if (byKey) return byKey;
        }

        if (bag && !Array.isArray(bag) && typeof bag === "object") {
            if (bag[target]) return bag[target];
            if (bag[subName]) return bag[subName];
        }

        const arr = this.asArray<any>(bag ?? group.getSubcommands?.() ?? group.getSubcommandsArray?.());
        return arr.find(s => this.getName(s)?.toLowerCase() === target);
    }

    // ─────────────────────────────────── ejecución ────────────────────────────────────

    override async execute(context: ChatInputCommandInteraction): Promise<any> {
        try {
            const hasGroups =
                Array.isArray(this.builder.subcommandgroups)
                    ? this.builder.subcommandgroups.length > 0
                    : !!this.builder.subcommandgroups;
            const hasSubs =
                Array.isArray(this.builder.subcommands)
                    ? this.builder.subcommands.length > 0
                    : !!this.builder.subcommands;

            // 1) Comando con parámetros directos (sin subcomandos/grupos)
            if (!hasGroups && !hasSubs) {
                await this.runPreconditions(this.builder.getPreconditions?.(), context);

                const paramsRec = this.builder.getParams?.() as Record<string, MiauSlashCommandParam> | undefined;
                const parsed = paramsRec ? this.resolveParamsFromRecord(context, paramsRec) : {};

                await (this.builder as any).execution(context, parsed);
                return;
            }

            // 2) Grupo + Subcomando
            if (hasGroups) {
                // ⚠️ getSubcommandGroup(false) -> string | null
                const groupName = context.options.getSubcommandGroup(false) ?? undefined;
                const subName = context.options.getSubcommand(true);

                const group = this.getGroupByName((this.builder as any).subcommandgroups, groupName);
                if (!group) {
                    throw new Error(`Grupo de subcomandos '${groupName ?? "(ninguno)"}' no encontrado.`);
                }

                const sub = this.getSubFromGroup(group, subName);
                if (!sub) {
                    const found =
                        this.asArray<any>(group.subcommands ?? group.getSubcommands?.())
                            .map(s => this.getName(s))
                            .filter(Boolean)
                            .join(", ") || "(ninguno)";
                    this.console.warning(["commandBuildWarn"] as any, `Subcomando '${subName}' no encontrado en '${groupName}'. Disponibles: ${found}`);
                    throw new Error(`Subcomando '${subName}' no encontrado en el grupo '${groupName}'.`);
                }

                // Precondiciones en cascada
                await this.runPreconditions(this.builder.getPreconditions?.(), context);
                await this.runPreconditions(group.getPreconditions?.(), context);
                await this.runPreconditions(sub.getPreconditions?.(), context);

                // Resolver parámetros del subcomando
                const parsed = typeof sub.resolveParams === "function"
                    ? sub.resolveParams(context)
                    : this.resolveParamsFromRecord(
                        context,
                        (sub.getParams?.() ?? {}) as Record<string, MiauSlashCommandParam>
                    );

                if (typeof sub.execution === "function") {
                    await sub.execution(context, parsed);
                } else {
                    await context.reply({ content: "⚠️ Este subcomando no tiene una ejecución definida en el grupo.", ephemeral: true });
                }
                return;
            }

            // 3) Subcomando directo (sin grupos)
            {
                const subName = context.options.getSubcommand(true);
                const subsArr = this.asArray<any>((this.builder as any).subcommands);
                const sub = subsArr.find(s => this.getName(s)?.toLowerCase() === subName.toLowerCase());
                if (!sub) {
                    throw new Error(`Subcomando '${subName}' no encontrado.`);
                }

                await this.runPreconditions(this.builder.getPreconditions?.(), context);
                await this.runPreconditions(sub.getPreconditions?.(), context);

                const parsed = typeof sub.resolveParams === "function"
                    ? sub.resolveParams(context)
                    : this.resolveParamsFromRecord(
                        context,
                        (sub.getParams?.() ?? {}) as Record<string, MiauSlashCommandParam>
                    );

                if (typeof sub.execution === "function") {
                    await sub.execution(context, parsed);
                } else {
                    await context.reply({ content: "⚠️ Este subcomando no tiene una ejecución definida.", ephemeral: true });
                }
                return;
            }

        } catch (error) {
            const errorId = client.utils.errorUtils?.newErrorId?.() ?? `E-${Date.now().toString(36)}`;
            const payload = client.utils.errorUtils?.redact
                ? client.utils.errorUtils.redact(client.utils.errorUtils.serializeError(error))
                : error;

            this.console.error(["commandExecutionError", errorId] as any, `[/${context.commandName}] Error de ejecución`, payload);

            const message = `❌ Ha ocurrido un error durante la ejecución. (ID: ${errorId})`;

            if (context.replied || context.deferred) {
                await context.followUp({ content: message, ephemeral: true }).catch(() => { });
            } else {
                await context.reply({ content: message, ephemeral: true }).catch(() => { });
            }
        }
    }

    async getHelp() {
        return this.builder.exportHelp(this.data);
    }

    setBuilder<B extends MiauSlashCommandBuilder>(b: B): B {
        this.builder = b;
        return b;
    }

    override execution: undefined;
    override setExecution: undefined;

    builder: MiauSlashCommandBuilder = new MiauSlashCommandBuilder();
}
