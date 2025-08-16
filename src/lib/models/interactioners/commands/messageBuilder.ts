import { Message } from "discord.js";
import {
    MiauMessageCommandDefaultData,
    MiauMessageCommandParam,
    MiauMessageCommandParamResponse,
} from "../../../interfaces/messageCommand";
import MiauMessageSubcommandBuilder from "./messageSubcommandBuilder";
import MiauMessageSubcommandgroupBuilder from "./messageSubcommandgroupBuilder";
import { ProtectedCollection } from "../../collection";
import Preconditions from "../../preconditions";

class MiauMessageCommandBuilder<
    TParams extends Record<string, MiauMessageCommandParam> = {}
> {
    private static readonly MAX_SUBCOMMANDS = 25;
    private static readonly MAX_GROUPS = 25;

    constructor(init?: {
        params?: TParams;
        subcommands?: MiauMessageSubcommandBuilder[];
        subcommandgroups?: MiauMessageSubcommandgroupBuilder[];
        execution?: (
            message: Message,
            params: ProtectedCollection<MiauMessageCommandParamResponse>
        ) => Promise<any>;
        preconditions?: Preconditions[];
    }) {
        if (init?.params) this.params = init.params;
        if (init?.subcommands) this.subcommands = init.subcommands;
        if (init?.subcommandgroups) this.subcommandgroups = init.subcommandgroups;
        if (init?.execution) this.execution = init.execution;
        if (init?.preconditions) this.preconditions = init.preconditions;
    }

    private params: TParams = {} as TParams;
    private preconditions: Preconditions[] = [];

    subcommands: MiauMessageSubcommandBuilder[] = [];
    subcommandgroups: MiauMessageSubcommandgroupBuilder[] = [];

    addPreconditions(...preconditions: Preconditions[]): this {
        this.preconditions.push(...preconditions);
        return this;
    }

    getPreconditions(): Preconditions[] {
        return this.preconditions;
    }

    addParam<const P extends MiauMessageCommandParam & { customId: string }>(
        param: P
    ): MiauMessageCommandBuilder<TParams & { [K in P["customId"]]: P }> {
        if (this.subcommands.length > 0)
            throw new Error("No se pueden añadir parámetros a un comando con subcomandos.");
        if (this.subcommandgroups.length > 0)
            throw new Error("No se pueden añadir parámetros a un comando con grupos.");

        const key = param.customId as P["customId"];

        if ((this.params as Record<string, unknown>)[key]) {
            throw new Error(`Ya existe un parámetro con customId '${key}'.`);
        }

        this.assertValidParam(param);

        const nextParams = {
            ...(this.params as Record<string, MiauMessageCommandParam>),
            [key]: param,
        } as TParams & { [K in P["customId"]]: P };

        return new MiauMessageCommandBuilder<TParams & { [K in P["customId"]]: P }>({
            params: nextParams,
            subcommands: this.subcommands,
            subcommandgroups: this.subcommandgroups,
            execution: this.execution,
            preconditions: this.preconditions,
        });
    }

    getParams(): TParams {
        return this.params;
    }

    getParamsArray(): MiauMessageCommandParam[] {
        return Object.values(this.params);
    }

    async execution(
        message: Message,
        _: ProtectedCollection<MiauMessageCommandParamResponse>
    ): Promise<any> {
        await message.reply({
            content: "¡Mensaje leído!\nPero... No sé qué debo hacer...",
        });
    }

    setExecution(
        f: (
            message: Message,
            params: ProtectedCollection<MiauMessageCommandParamResponse>
        ) => Promise<any>
    ): this {
        if (typeof f !== "function") {
            throw new TypeError("setExecution requiere una función asíncrona válida.");
        }
        this.execution = f;
        return this;
    }

    addSubcommand(
        s: (subcommand: MiauMessageSubcommandBuilder) => MiauMessageSubcommandBuilder
    ): this {
        if (Object.keys(this.params as Record<string, unknown>).length > 0)
            throw new Error("No se pueden añadir subcomandos a un comando con parámetros.");

        if (this.subcommandgroups.length > 0)
            throw new Error("No se pueden añadir subcomandos si el comando tiene grupos.");

        if (this.subcommands.length >= MiauMessageCommandBuilder.MAX_SUBCOMMANDS)
            throw new Error("Este comando ya tiene 25 subcomandos.");

        const sub = s(new MiauMessageSubcommandBuilder());
        this.assertValidSubcommand(sub);

        const name = (sub as any).name ?? (sub as any).getName?.();
        if (!name || typeof name !== "string") {
            throw new Error("Subcomando sin nombre válido.");
        }
        if (this.subcommands.some(sc => (sc as any).name?.toLowerCase() === name.toLowerCase())) {
            throw new Error(`Subcomando duplicado: '${name}'.`);
        }

        this.subcommands.push(sub);
        return this;
    }

    addSubcommandgroup(
        g: (
            subcommandgroup: MiauMessageSubcommandgroupBuilder
        ) => MiauMessageSubcommandgroupBuilder
    ): this {
        if (Object.keys(this.params as Record<string, unknown>).length > 0)
            throw new Error("No se pueden añadir grupos a un comando con parámetros.");

        if (this.subcommands.length > 0)
            throw new Error("No se pueden añadir grupos si el comando tiene subcomandos.");

        if (this.subcommandgroups.length >= MiauMessageCommandBuilder.MAX_GROUPS)
            throw new Error("Este comando ya tiene 25 grupos.");

        const group = g(new MiauMessageSubcommandgroupBuilder());
        this.assertValidSubcommandGroup(group);

        const name = (group as any).name ?? (group as any).getName?.();
        if (!name || typeof name !== "string") {
            throw new Error("Grupo de subcomandos sin nombre válido.");
        }
        if (this.subcommandgroups.some(gr => (gr as any).name?.toLowerCase() === name.toLowerCase())) {
            throw new Error(`Grupo de subcomandos duplicado: '${name}'.`);
        }

        return this;
    }

    getSubcommands(): MiauMessageSubcommandBuilder[] {
        return this.subcommands;
    }

    getSubcommandgroups(): MiauMessageSubcommandgroupBuilder[] {
        return this.subcommandgroups;
    }

    toJSON(data: MiauMessageCommandDefaultData): Object {
        if (!this.test(data)) {
            throw new Error("El comando Message no es válido.");
        }
        return {
            name: data.name,
            alias: data.alias,
            description: data.description,
        };
    }

    test(data: MiauMessageCommandDefaultData): boolean {
        const nameOk =
            typeof data.name === "string" &&
            data.name.trim().length >= 1 &&
            data.name.trim().length <= 64;

        const aliasOk =
            data.alias === undefined ||
            (Array.isArray(data.alias) && data.alias.every(a => typeof a === "string" && a.trim().length > 0));

        const descOk =
            typeof data.description === "string" &&
            data.description.trim().length >= 1 &&
            data.description.trim().length <= 200;

        const hasSubs = this.subcommands.length > 0;
        const hasGroups = this.subcommandgroups.length > 0;
        const hasParams = Object.keys(this.params as Record<string, unknown>).length > 0;
        const oneTypeOnly = [hasSubs, hasGroups, hasParams].filter(Boolean).length <= 1;

        const paramsOk = this.getParamsArray().every(p => this.isParamStructValid(p));

        const subsOk = this.subcommands.every(sc => this.isSubcommandValid(sc));

        const groupsOk = this.subcommandgroups.every(gr => this.isSubcommandGroupValid(gr));

        const subsUnique =
            new Set(this.subcommands.map(sc => (sc as any).name?.toLowerCase())).size === this.subcommands.length;
        const groupsUnique =
            new Set(this.subcommandgroups.map(gr => (gr as any).name?.toLowerCase())).size === this.subcommandgroups.length;

        return (
            nameOk &&
            aliasOk &&
            descOk &&
            oneTypeOnly &&
            paramsOk &&
            subsOk &&
            groupsOk &&
            subsUnique &&
            groupsUnique
        );
    }

    private isParamStructValid(p: MiauMessageCommandParam): boolean {
        if (!p || typeof p !== "object") return false;
        if (typeof (p as any).customId !== "string" || (p as any).customId.trim().length < 1) return false;
        if (typeof p.description !== "string" || p.description.trim().length < 1) return false;
        if (!("type" in p)) return false;
        if ("min_len" in (p as any) && typeof (p as any).min_len !== "number") return false;
        if ("max_len" in (p as any) && typeof (p as any).max_len !== "number") return false;
        return true;
    }

    private assertValidParam(p: MiauMessageCommandParam): void {
        if (!this.isParamStructValid(p)) {
            throw new Error("Parámetro con estructura incorrecta.");
        }
    }

    private isSubcommandValid(sc: MiauMessageSubcommandBuilder): boolean {
        const anySc = sc as any;
        if (typeof anySc?.test === "function") return !!anySc.test();
        return typeof anySc?.name === "string" && anySc.name.trim().length >= 1;
    }

    private isSubcommandGroupValid(gr: MiauMessageSubcommandgroupBuilder): boolean {
        const anyGr = gr as any;
        if (typeof anyGr?.test === "function") return !!anyGr.test();
        return typeof anyGr?.name === "string" && anyGr.name.trim().length >= 1;
    }

    private assertValidSubcommand(sc: MiauMessageSubcommandBuilder): void {
        if (!this.isSubcommandValid(sc)) {
            throw new Error("El subcomando parece estar mal declarado.");
        }
    }

    private assertValidSubcommandGroup(gr: MiauMessageSubcommandgroupBuilder): void {
        if (!this.isSubcommandGroupValid(gr)) {
            throw new Error("El grupo de subcomandos parece estar mal declarado.");
        }
    }
}

export default MiauMessageCommandBuilder;
