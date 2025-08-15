import { Message } from "discord.js";
import {
    MiauMessageCommandParam,
    MiauMessageCommandParamResponse
} from "../../../interfaces/messageCommand";
import MiauMessageSubcommandBuilder from "./messageSubcommandBuilder";
import { ProtectedCollection } from "../../collection";

class MiauMessageSubcommandgroupBuilder<
    TParams extends Record<string, MiauMessageCommandParam> = {}
> {
    constructor(init?: {
        params?: TParams;
        subcommands?: MiauMessageSubcommandBuilder[];
        name?: string;
        description?: string;
        execution?: (
            message: Message,
            params: ProtectedCollection<MiauMessageCommandParamResponse>
        ) => Promise<void>;
    }) {
        if (init?.params) this.params = init.params;
        if (init?.subcommands) this.subcommands = init.subcommands;
        if (init?.name) this.name = init.name;
        if (init?.description) this.description = init.description;
        if (init?.execution) this.execution = init.execution;
    }

    // Estado
    private params: TParams = {} as TParams;
    subcommands: MiauMessageSubcommandBuilder[] = [];
    name: string | undefined = undefined;
    description: string | undefined = undefined;

    async execution(
        message: Message,
        _: ProtectedCollection<MiauMessageCommandParamResponse>
    ): Promise<void> {
        await message.reply("¡Hola! No tengo ni idea de qué se supone que debo hacer :D");
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    setDescription(description: string): this {
        this.description = description;
        return this;
    }

    setExecution(
        f: (
            message: Message,
            params: ProtectedCollection<MiauMessageCommandParamResponse>
        ) => Promise<void>
    ): this {
        this.execution = f;
        return this;
    }

    addSubcommand(
        s: (subcommand: MiauMessageSubcommandBuilder) => MiauMessageSubcommandBuilder
    ): this {
        const subcommand = new MiauMessageSubcommandBuilder();
        this.subcommands.push(s(subcommand));
        return this;
    }

    // --- addParam con key explícita ---
    addParam<K extends string, P extends MiauMessageCommandParam>(
        key: K,
        param: P
    ): MiauMessageSubcommandgroupBuilder<TParams & Record<K, P>>;

    // --- addParam usando param.customId como key ---
    addParam<P extends MiauMessageCommandParam & { customId: string }>(
        param: P
    ): MiauMessageSubcommandgroupBuilder<TParams & Record<P["customId"], P>>;

    // Implementación
    addParam(a: any, b?: any): any {
        const key: string = typeof a === "string" ? a : a.customId;
        const param: MiauMessageCommandParam =
            typeof a === "string" ? b : (a as MiauMessageCommandParam);

        // TODO: Verificar que el parámetro es correcto.

        const nextParams = {
            ...(this.params as Record<string, MiauMessageCommandParam>),
            [key]: param
        } as any;

        return new MiauMessageSubcommandgroupBuilder({
            params: nextParams,
            subcommands: this.subcommands,
            name: this.name,
            description: this.description,
            execution: this.execution
        });
    }

    // Acceso tipado y helpers
    getParams(): TParams {
        return this.params;
    }

    getParamsArray(): MiauMessageCommandParam[] {
        return Object.values(this.params);
    }
}

export default MiauMessageSubcommandgroupBuilder;
