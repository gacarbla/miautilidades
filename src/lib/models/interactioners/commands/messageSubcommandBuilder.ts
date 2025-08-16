import { Message } from "discord.js";
import {
    MiauMessageCommandParam,
    MiauMessageCommandParamResponse
} from "../../../interfaces/messageCommand";
import { ProtectedCollection } from "../../collection";

class MiauMessageSubcommandBuilder<
    TParams extends Record<string, MiauMessageCommandParam> = {}
> {
    // Estado tipado
    private params: TParams = {} as TParams;
    name: string | undefined = undefined;
    description: string | undefined = undefined;

    constructor(init?: {
        params?: TParams;
        name?: string;
        description?: string;
        execution?: (message: Message, params: ProtectedCollection<MiauMessageCommandParamResponse>) => Promise<any>;
    }) {
        if (init?.params) this.params = init.params;
        if (init?.name) this.name = init.name;
        if (init?.description) this.description = init.description;
        if (init?.execution) this.execution = init.execution;
    }

    // --- ejecución por defecto ---
    async execution(
        message: Message,
        _: ProtectedCollection<MiauMessageCommandParamResponse>
    ): Promise<any> {
        await message.reply("¡Hola! No tengo ni idea de qué hace ese comando...");
    }

    // --- setters “in place” (no cambian el tipo genérico) ---
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
        ) => Promise<any>
    ): this {
        this.execution = f;
        return this;
    }

    // --- addParam con key explícita (infiere y acumula tipo) ---
    addParam<K extends string, P extends MiauMessageCommandParam>(
        key: K,
        param: P
    ): MiauMessageSubcommandBuilder<TParams & Record<K, P>>;

    // --- addParam usando param.customId como key (si lo prefieres) ---
    addParam<P extends MiauMessageCommandParam & { customId: string }>(
        param: P
    ): MiauMessageSubcommandBuilder<TParams & Record<P["customId"], P>>;

    // --- implementación única ---
    addParam(a: any, b?: any): any {
        const key: string = typeof a === "string" ? a : a.customId;
        const param: MiauMessageCommandParam =
            typeof a === "string" ? b : (a as MiauMessageCommandParam);

        // TODO: Verificar que el parámetro es correcto.

        const nextParams = {
            ...(this.params as Record<string, MiauMessageCommandParam>),
            [key]: param
        } as any;

        // Devolvemos NUEVA instancia con tipo acumulado (fluida e inmutable)
        return new MiauMessageSubcommandBuilder({
            params: nextParams,
            name: this.name,
            description: this.description,
            execution: this.execution
        });
    }

    // --- acceso tipado y helpers ---
    getParams(): TParams {
        return this.params;
    }

    getParamsArray(): MiauMessageCommandParam[] {
        return Object.values(this.params);
    }
}

export default MiauMessageSubcommandBuilder;
