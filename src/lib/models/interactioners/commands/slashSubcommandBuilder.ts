import {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
} from "discord.js";
import { MiauSlashCommandParam } from "../../../interfaces/interaction";
import client from "../../../..";
import { interactionNameRegEx } from "../../../constants/discord";
import Preconditions from "../../preconditions";
import { ParamsFrom } from "../../../types/slashCommands";
import { SlashParamTypes } from "../../../enum/interactions";

type SlashCommandParamType = MiauSlashCommandParam["type"]; // = SlashParamType | SlashParamTypes

function toDiscordOptionType(t: SlashCommandParamType): ApplicationCommandOptionType {
    // Soportar strings
    if (typeof t === "string") {
        switch (t) {
            case "LETTER":
            case "WORD":
            case "TEXT": return ApplicationCommandOptionType.String;
            case "NUMBER": return ApplicationCommandOptionType.Number;
            case "INTEGER": return ApplicationCommandOptionType.Integer;
            case "BOOLEAN": return ApplicationCommandOptionType.Boolean;
            case "USER":
            case "MEMBER": return ApplicationCommandOptionType.User; // MEMBER se resuelve como USER en Discord
            case "ROLE": return ApplicationCommandOptionType.Role;
            case "CHANNEL": return ApplicationCommandOptionType.Channel;
            case "MENTIONABLE": return ApplicationCommandOptionType.Mentionable;
            case "ATTACHMENT": return ApplicationCommandOptionType.Attachment;
            default:
                throw new Error(`Tipo de slash no soportado: ${String(t)}`);
        }
    }
    // Soportar enum (numérico)
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
        default:
            throw new Error(`Tipo de slash (enum) no soportado: ${String(t)}`);
    }
}

function isTextType(t: SlashCommandParamType): boolean {
    if (typeof t === "string") return t === "LETTER" || t === "WORD" || t === "TEXT";
    return t === SlashParamTypes.LETTER || t === SlashParamTypes.WORD || t === SlashParamTypes.TEXT;
}

class MiauSlashSubcommandBuilder<
    TParams extends Record<string, MiauSlashCommandParam> = {}
> {
    private static readonly MAX_OPTIONS = 25;

    constructor(init?: {
        params?: TParams;
        name?: string;
        description?: string;
        execution?: (
            interaction: ChatInputCommandInteraction,
            params: ParamsFrom<TParams>
        ) => Promise<any>;
        preconditions?: Preconditions[];
    }) {
        if (init?.params) this.params = init.params;
        if (init?.name) this.name = init.name;
        if (init?.description) this.description = init.description;
        if (init?.execution) this.execution = init.execution;
        if (init?.preconditions) this.preconditions = init.preconditions;
    }

    private console = client.utils.console;

    async execution(
        interaction: ChatInputCommandInteraction,
        params: ParamsFrom<TParams>
    ): Promise<any> {
        try {
            void params;
            if (!interaction.deferred && !interaction.replied) {
                await interaction.reply({
                    content: "⚠️ Este subcomando no tiene una ejecución definida.",
                    ephemeral: true,
                });
            }
        } catch (err) {
            this.console.error(["error", "executionError"], "Fallo en ejecución por defecto:", err);
        }
    }

    private params: TParams = {} as TParams;

    name?: string;
    private description?: string;

    private preconditions: Preconditions[] = [];

    addPreconditions(...preconditions: Preconditions[]): this {
        this.preconditions.push(...preconditions);
        return this;
    }

    getPreconditions(): Preconditions[] {
        return this.preconditions;
    }

    setName(name: string): this {
        const trimmed = name.trim();
        if (trimmed.length < 1 || trimmed.length > 32) {
            this.console.error(["error", "commandBuildError"], "Tamaño incorrecto en el nombre. Debe ser de 1 a 32 caracteres.");
            throw new Error("El nombre debe tener entre 1 y 32 caracteres.");
        }
        if (trimmed !== trimmed.toLowerCase()) {
            this.console.warning(["commandBuildError"], "Los comandos slash no aceptan mayúsculas en su nombre.");
        }
        if (!interactionNameRegEx.test(trimmed)) {
            this.console.error(["error", "commandBuildError"], "El nombre contiene caracteres inválidos.");
            throw new Error("El nombre contiene caracteres inválidos.");
        }
        this.name = trimmed;
        return this;
    }

    setDescription(description: string): this {
        let desc = description.trim();
        if (desc.length < 1) {
            this.console.error(["error", "commandBuildError"], "La descripción debe tener al menos un carácter.");
            throw new Error("La descripción debe tener al menos un carácter.");
        }
        if (desc.length > 100) {
            this.console.warning(["commandBuildError"], "La descripción no puede exceder los 100 caracteres. Se truncará.");
            desc = desc.substring(0, 100);
        }
        this.description = desc;
        return this;
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

    // Inmutable: amplía TParams por customId (o key explícita)
    addParam<const P extends MiauSlashCommandParam & { customId: string }>(
        param: P
    ): MiauSlashSubcommandBuilder<TParams & { [K in P["customId"]]: P }>;
    addParam<const K extends string, const P extends MiauSlashCommandParam>(
        key: K,
        param: P
    ): MiauSlashSubcommandBuilder<TParams & { [Q in K]: P }>;
    addParam(a: any, b?: any): any {
        const key: string = typeof a === "string" ? a : a.customId;
        const param: MiauSlashCommandParam = typeof a === "string" ? b : (a as MiauSlashCommandParam);

        if (!client.utils.Interactions.verify.param.slash(param)) {
            throw new Error("Parámetro con estructura incorrecta.");
        }
        const currentCount = Object.keys(this.params as Record<string, unknown>).length;
        if (currentCount >= MiauSlashSubcommandBuilder.MAX_OPTIONS) {
            this.console.error(["error", "commandBuildError"], "Se excede el límite de 25 parámetros.");
            throw new Error("Este subcomando ya tiene 25 parámetros.");
        }
        if ((this.params as Record<string, unknown>)[key] !== undefined) {
            this.console.error(["error", "commandBuildError"], `Parámetro duplicado: '${key}'.`);
            throw new Error(`Ya existe un parámetro con customId '${key}'.`);
        }

        const nextParams = {
            ...(this.params as Record<string, MiauSlashCommandParam>),
            [key]: param,
        } as TParams & Record<typeof key, typeof param>;

        return new MiauSlashSubcommandBuilder<any>({
            params: nextParams,
            name: this.name,
            description: this.description,
            execution: this.execution.bind(this),
            preconditions: this.preconditions,
        }) as unknown as MiauSlashSubcommandBuilder<
            TParams & Record<typeof key, typeof param>
        >;
    }

    getParams(): TParams {
        return this.params;
    }

    getParamsArray(): MiauSlashCommandParam[] {
        return Object.values(this.params);
    }

    // helper opcional para legibilidad
    private isMemberType(t: MiauSlashCommandParam["type"]): boolean {
        return (typeof t === "string" ? t === "MEMBER" : t === SlashParamTypes.MEMBER);
    }

    // --- Resuelve params con tipos correctos según tu DSL ---
    resolveParams(interaction: ChatInputCommandInteraction): ParamsFrom<TParams> {
        const out: Record<string, unknown> = {};
        const entries = Object.entries(this.params) as [keyof TParams & string, TParams[keyof TParams]][];

        for (const [key, p] of entries) {
            const required = !!p.required;
            const t = p.type;

            // Normalizamos a métodos de discord.js según tu tipo
            const discordType = toDiscordOptionType(t);
            switch (discordType) {
                case ApplicationCommandOptionType.String: {
                    const v = interaction.options.getString(key, required);
                    out[key] = v ?? undefined;
                    break;
                }
                case ApplicationCommandOptionType.Integer: {
                    const v = interaction.options.getInteger(key, required);
                    out[key] = v ?? undefined;
                    break;
                }
                case ApplicationCommandOptionType.Number: {
                    const v = interaction.options.getNumber(key, required);
                    out[key] = v ?? undefined;
                    break;
                }
                case ApplicationCommandOptionType.Boolean: {
                    const v = interaction.options.getBoolean(key, required);
                    out[key] = v ?? undefined;
                    break;
                }
                case ApplicationCommandOptionType.User: {
                    if (this.isMemberType(t)) {
                        // getMember(name) => GuildMember | null   (sin 'required')
                        const m = interaction.options.getMember(key);
                        if (required && !m) {
                            // Discord no debería permitir que falte si es required, pero por si acaso:
                            throw new Error(`Falta el parámetro requerido '${key}' (MEMBER).`);
                        }
                        out[key] = m ?? undefined;
                    } else {
                        const u = interaction.options.getUser(key, required);
                        out[key] = u ?? undefined;
                    }
                    break;
                }
                case ApplicationCommandOptionType.Role: {
                    const v = interaction.options.getRole(key, required);
                    out[key] = v ?? undefined;
                    break;
                }
                case ApplicationCommandOptionType.Channel: {
                    const v = interaction.options.getChannel(key, required);
                    out[key] = v ?? undefined;
                    break;
                }
                case ApplicationCommandOptionType.Mentionable: {
                    const v = interaction.options.getMentionable(key, required);
                    out[key] = v ?? undefined; // User | Role | GuildMember
                    break;
                }
                case ApplicationCommandOptionType.Attachment: {
                    const v = interaction.options.getAttachment(key, required);
                    out[key] = v ?? undefined;
                    break;
                }
                default:
                    this.console.warning(["commandBuildWarn"], `Tipo no soportado: ${String(t)} (${key})`);
                    out[key] = undefined;
            }
        }

        return out as ParamsFrom<TParams>;
    }

    async run(interaction: ChatInputCommandInteraction): Promise<any> {
        const params = this.resolveParams(interaction);
        await this.execution(interaction, params);
    }

    test(): boolean {
        const nameOk =
            typeof this.name === "string" &&
            interactionNameRegEx.test(this.name) &&
            this.name.length >= 1 &&
            this.name.length <= 32;

        const descOk =
            typeof this.description === "string" &&
            this.description.length >= 1 &&
            this.description.length <= 100;

        const paramsArr = this.getParamsArray();

        const countOk = paramsArr.length <= MiauSlashSubcommandBuilder.MAX_OPTIONS;
        const allParamsValid = paramsArr.every((p) =>
            client.utils.Interactions.verify.param.slash(p)
        );
        const noDuplicates =
            new Set(paramsArr.map((p) => p.customId)).size === paramsArr.length;

        return nameOk && descOk && countOk && allParamsValid && noDuplicates;
    }

    toJSON() {
        if (!this.test()) {
            this.console.error(["error", "commandBuildError"], "El subcomando no es válido.");
            throw new Error("El subcomando no es válido.");
        }

        return {
            name: this.name!.toLowerCase(),
            description: this.description!,
            type: 1 as const, // Subcommand
            options: this.paramsToOptionsJSON(),
        };
    }

    private paramsToOptionsJSON() {
        const arr = this.getParamsArray();

        const required = arr.filter((p) => p.required);
        const optional = arr.filter((p) => !p.required);
        const ordered = [...required, ...optional];

        return ordered.map((param) => {
            const optionType = toDiscordOptionType(param.type);

            const base: any = {
                type: optionType,
                name: String(param.customId).toLowerCase(),
                description: param.description,
                required: param.required ?? false,
            };

            // Sólo choices para tipos de texto
            if (isTextType(param.type) && "choices" in param && Array.isArray((param as any).choices)) {
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

    exportHelp(): { name: string; description: string; params: string[] } {
        return {
            name: this.name ?? "desconocido",
            description: this.description ?? "",
            params: this.getParamsArray().map((p) => `${p.customId}${p.required ? "*" : ""}`),
        };
    }
}

export default MiauSlashSubcommandBuilder;
