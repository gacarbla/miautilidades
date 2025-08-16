import { Message } from "discord.js";
import Emoji from "../../enum/emojis";
import MiauInteraction from "./interaction";
import MiauMessageCommandBuilder from "./commands/messageBuilder";
import { MiauMessageCommandDefaultData } from "../../interfaces/messageCommand";
import client from "../../..";

export default class MiauMessageCommand extends MiauInteraction {
    data: MiauMessageCommandDefaultData;

    override noPermissionMenssage: string =
        Emoji.ERROR + "No tienes permisos para ejecutar este comando";

    constructor(data: MiauMessageCommandDefaultData) {
        super();
        this.data = data;
    }

    builder: MiauMessageCommandBuilder = new MiauMessageCommandBuilder();

    toJSON(): Object {
        return this.builder.toJSON(this.data);
    }

    private stripLeadingMentionsAndSpaces(text: string): string {
        return text.replace(/^(?:\s*<@!?\d+>\s*)+/, "").trimStart();
    }

    private tokenize(text: string): string[] {
        return text.trim().split(/\s+/).filter(Boolean);
    }

    private normalizeToken(t: string): string {
        return t.replace(/^[^\p{L}\p{N}_-]+/u, "").toLowerCase();
    }

    private findInvocationIndex(tokens: string[], names: string[]): number {
        const lowers = names.map((n) => n.toLowerCase());
        for (let i = 0; i < tokens.length; i++) {
            const norm = this.normalizeToken(tokens[i]);
            if (lowers.includes(norm)) return i;
            if (lowers.some((n) => tokens[i].toLowerCase().endsWith(n))) return i;
        }
        return -1;
    }

    private asArray<T = any>(input: any): T[] {
        if (!input) return [];
        if (Array.isArray(input)) return input as T[];
        if (typeof input[Symbol.iterator] === "function") {
            try { return Array.from(input as Iterable<T>); } catch { }
        }
        if (typeof input.values === "function") {
            try { return Array.from(input.values() as Iterable<T>); } catch { }
        }
        if (typeof input.toArray === "function") {
            try { return input.toArray() as T[]; } catch { }
        }
        if (typeof input === "object") {
            try { return Object.values(input) as T[]; } catch { }
        }
        return [];
    }

    private getName(x: any): string | undefined {
        return x?.name ?? x?.getName?.() ?? x?.data?.name;
    }

    private getGroupByName(groups: any, name?: string): any | undefined {
        if (!name) return undefined;
        const lower = name.toLowerCase();
        return this.asArray<any>(groups).find((g) => this.getName(g)?.toLowerCase() === lower);
    }

    private getSubByName(bag: any, name?: string): any | undefined {
        if (!name) return undefined;
        const lower = name.toLowerCase();

        if (bag?.get) {
            return bag.get(lower) ?? bag.get(name);
        }
        if (bag && !Array.isArray(bag) && typeof bag === "object") {
            return bag[lower] ?? bag[name];
        }
        const arr = this.asArray<any>(bag);
        return arr.find((s) => this.getName(s)?.toLowerCase() === lower);
    }

    private async runPreconditions(list: any[] | undefined, msg: Message): Promise<void> {
        if (!list?.length) return;
        for (const p of list) {
            const fn = (p as any).run ?? (p as any).execute ?? (p as any).check ?? (p as any).test;
            if (typeof fn === "function") {
                const res = await fn.call(p, msg);
                if (res === false || (res && res.allowed === false)) {
                    const reason = (res && (res.reason || res.message)) || this.noPermissionMenssage;
                    throw new Error(String(reason));
                }
            }
        }
    }

    override async execution(message: Message): Promise<any> {
        try {
            const raw = this.stripLeadingMentionsAndSpaces(message.content ?? "");
            const tokens = this.tokenize(raw);
            if (tokens.length === 0) return;

            const names = [this.data.name, ...(this.data.alias ?? [])];
            const idx = this.findInvocationIndex(tokens, names);
            if (idx === -1) return;

            const args = tokens.slice(idx + 1);
            const argsString = args.join(" ");

            const hasGroups =
                Array.isArray(this.builder.subcommandgroups)
                    ? this.builder.subcommandgroups.length > 0
                    : !!(this.builder as any).subcommandgroups;
            const hasSubs =
                Array.isArray(this.builder.subcommands)
                    ? this.builder.subcommands.length > 0
                    : !!(this.builder as any).subcommands;

            if (!hasGroups && !hasSubs) {
                await this.runPreconditions(this.builder.getPreconditions?.(), message);

                const exec = (this.builder as any).execution;
                if (typeof exec === "function") {
                    if (exec.length >= 2) {
                        await exec.call(this.builder, message, argsString);
                    } else {
                        await exec.call(this.builder, message);
                    }
                } else {
                    await message.reply("⚠️ Este comando no tiene una ejecución definida.");
                }
                return;
            }

            if (hasGroups) {
                if (args.length === 0) {
                    throw new Error("Falta el nombre del **grupo** y el **subcomando**.");
                }
                const groupName = this.normalizeToken(args[0]);
                const group = this.getGroupByName((this.builder as any).subcommandgroups, groupName);
                if (!group) {
                    const avail = this.asArray<any>((this.builder as any).subcommandgroups)
                        .map((g) => this.getName(g))
                        .filter(Boolean)
                        .join(", ") || "(ninguno)";
                    throw new Error(`Grupo '${groupName}' no encontrado. Disponibles: ${avail}`);
                }

                if (args.length < 2) {
                    throw new Error(`Falta el **subcomando** del grupo '${this.getName(group) ?? groupName}'.`);
                }
                const subName = this.normalizeToken(args[1]);
                const sub =
                    this.getSubByName(group.subcommands ?? group.getSubcommands?.(), subName) ??
                    (typeof group.getSubcommand === "function" ? group.getSubcommand(subName) : undefined);

                if (!sub) {
                    const avail = this.asArray<any>(group.subcommands ?? group.getSubcommands?.())
                        .map((s) => this.getName(s))
                        .filter(Boolean)
                        .join(", ") || "(ninguno)";
                    throw new Error(`Subcomando '${subName}' no encontrado en '${this.getName(group) ?? groupName}'. Disponibles: ${avail}`);
                }

                await this.runPreconditions(this.builder.getPreconditions?.(), message);
                await this.runPreconditions(group.getPreconditions?.(), message);
                await this.runPreconditions(sub.getPreconditions?.(), message);

                const rest = args.slice(2);
                const restString = rest.join(" ");

                const exec = sub.execution;
                if (typeof sub.resolveParams === "function") {
                    const params = sub.resolveParams(message, restString, rest);
                    await exec.call(sub, message, params);
                } else if (typeof sub.resolveArgs === "function") {
                    const params = sub.resolveArgs(message, restString, rest);
                    await exec.call(sub, message, params);
                } else if (typeof exec === "function") {
                    if (exec.length >= 2) {
                        await exec.call(sub, message, restString);
                    } else {
                        await exec.call(sub, message);
                    }
                } else {
                    await message.reply("⚠️ Este subcomando no tiene una ejecución definida.");
                }
                return;
            }

            {
                if (args.length === 0) {
                    const avail = this.asArray<any>((this.builder as any).subcommands)
                        .map((s) => this.getName(s))
                        .filter(Boolean)
                        .join(", ") || "(ninguno)";
                    throw new Error(`Falta el **subcomando**. Disponibles: ${avail}`);
                }

                const subName = this.normalizeToken(args[0]);
                const sub = this.getSubByName((this.builder as any).subcommands, subName);
                if (!sub) {
                    const avail = this.asArray<any>((this.builder as any).subcommands)
                        .map((s) => this.getName(s))
                        .filter(Boolean)
                        .join(", ") || "(ninguno)";
                    throw new Error(`Subcomando '${subName}' no encontrado. Disponibles: ${avail}`);
                }

                await this.runPreconditions(this.builder.getPreconditions?.(), message);
                await this.runPreconditions(sub.getPreconditions?.(), message);

                const rest = args.slice(1);
                const restString = rest.join(" ");

                const exec = sub.execution;
                if (typeof sub.resolveParams === "function") {
                    const params = sub.resolveParams(message, restString, rest);
                    await exec.call(sub, message, params);
                } else if (typeof sub.resolveArgs === "function") {
                    const params = sub.resolveArgs(message, restString, rest);
                    await exec.call(sub, message, params);
                } else if (typeof exec === "function") {
                    if (exec.length >= 2) {
                        await exec.call(sub, message, restString);
                    } else {
                        await exec.call(sub, message);
                    }
                } else {
                    await message.reply("⚠️ Este subcomando no tiene una ejecución definida.");
                }
                return;
            }
        } catch (error) {
            const errorId = client.utils?.errorUtils?.newErrorId?.() ?? `E-${Date.now().toString(36)}`;
            const payload = client.utils?.errorUtils?.redact
                ? client.utils.errorUtils.redact(client.utils.errorUtils.serializeError(error))
                : error;

            this.console.error(["commandExecutionError", errorId] as any, `[${this.data.name}] Error de ejecución`, payload);

            try {
                await message.reply(`❌ Ha ocurrido un error durante la ejecución. (ID: ${errorId})`);
            } catch { }
        }
    }

    override setExecution: undefined;
}
