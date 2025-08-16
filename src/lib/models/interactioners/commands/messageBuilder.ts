import { Message } from "discord.js"
import { MiauMessageCommandDefaultData, MiauMessageCommandParam, MiauMessageCommandParamResponse } from "../../../interfaces/messageCommand"
import MiauMessageSubcommandBuilder from "./messageSubcommandBuilder"
import MiauMessageSubcommandgroupBuilder from "./messageSubcommandgroupBuilder"
import { ProtectedCollection } from "../../collection"

/**
 * > ** **
 * ### ¿Qué es esto?
 * Clase de construcción de comandos Message
 * 
 * **No se recomienda su uso fuera del constructor de comandos Message.**
 */
class MiauMessageCommandBuilder<
    TParams extends Record<string, MiauMessageCommandParam> = {}
> {
    constructor(init?: {
        params?: TParams;
        subcommands?: MiauMessageSubcommandBuilder[];
        subcommandgroups?: MiauMessageSubcommandgroupBuilder[];
        execution?: (
            message: Message,
            params: ProtectedCollection<MiauMessageCommandParamResponse>
        ) => Promise<any>;
    }) {
        if (init?.params) this.params = init.params;
        if (init?.subcommands) this.subcommands = init.subcommands;
        if (init?.subcommandgroups) this.subcommandgroups = init.subcommandgroups;
        if (init?.execution) this.execution = init.execution;
    }

    private params: TParams = {} as TParams;
    subcommands: MiauMessageSubcommandBuilder[] = []
    subcommandgroups: MiauMessageSubcommandgroupBuilder[] = []

    // TODO: Permitir añadir precondiciones al comando.

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función para añadir parámetros al comando base.
     * 
     * Los parámetros son campos que el usuario debe introducir de forma obligatoria para que el comando funcione.
     * 
     * En el siguiente ejemplo, los parámetros serán `-channel` o `--c` y `-status` o `--s`
     * 
     * ```txt
     * gw!podcast -channel #oyentes -status active
     * gw!podcast --c #oyentes --s active
     * ```
     */
    addParam<const P extends MiauMessageCommandParam & { customId: string }>(
        param: P
    ): MiauMessageCommandBuilder<TParams & { [K in P["customId"]]: P }> {
        const key = param.customId as P["customId"];

        // (opcional) valida duplicados
        if ((this.params as Record<string, unknown>)[key]) {
            throw new Error(`Ya existe un parámetro con customId '${key}'.`);
        }

        const nextParams = {
            ...(this.params as Record<string, MiauMessageCommandParam>),
            [key]: param,
        } as TParams & { [K in P["customId"]]: P };

        // devolvemos nueva instancia con el tipo acumulado
        return new MiauMessageCommandBuilder<TParams & { [K in P["customId"]]: P }>({
            params: nextParams,
            subcommands: this.subcommands,
            subcommandgroups: this.subcommandgroups,
            execution: this.execution,
        });
    }

    getParams(): TParams {
        return this.params;
    }

    getParamsArray(): MiauMessageCommandParam[] {
        return Object.values(this.params);
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función de ejecución.
     * 
     * Se recomienda no alterarla manualmente. Utiliza la función `setExecution`.
     */
    async execution(
        message: Message,
        _: ProtectedCollection<MiauMessageCommandParamResponse>
    ): Promise<any> {
        message.reply({
            content: "¡Mensaje leído!\nPero... No sé qué debo hacer...",
        });
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * Función que establece la ejecución designada al comando.
     */
    setExecution(
        f: (
            message: Message,
            params: ProtectedCollection<MiauMessageCommandParamResponse>
        ) => Promise<any>
    ): this {
        this.execution = f;
        return this;
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * 
     */
    addSubcommand(s: (subcommand: MiauMessageSubcommandBuilder) => MiauMessageSubcommandBuilder): this {
        const subcommand = new MiauMessageSubcommandBuilder()
        // TODO: Antes de añadir el subcomando, verificar que es correcto.
        this.subcommands.push(s(subcommand))
        return this
    }

    /**
     * > ** **
     * ### ¿Qué es esto?
     * 
     */
    addSubcommandgroup(g: (subcommand: MiauMessageSubcommandgroupBuilder) => MiauMessageSubcommandgroupBuilder): this {
        const subcommandgroup = new MiauMessageSubcommandgroupBuilder()
        // TODO: Antes de añadir el grupo, verificar que es correcto.
        this.subcommandgroups.push(g(subcommandgroup))
        return this
    }

    toJSON(data: MiauMessageCommandDefaultData): Object {
        return {
            name: data.name,
            alias: data.alias,
            description: data.description
        }
    }
    // TODO: Añadir función `test` que permita comprobar si el comando cumple los requisitos para ser válido.
}

export default MiauMessageCommandBuilder