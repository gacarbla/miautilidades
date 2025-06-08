import { SlashParamTypes } from "../../../enum/interactions";
import {
    MiauSlashCommandParam,
    MiauSlashCommandParamResponse
} from "../../../interfaces/interaction";
import { MiauMessageCommandParam } from "../../../interfaces/messageCommand";
import { SlashCommandParamType } from "../../../types/interactions";
import MiauInteraction from "../interaction";
import MiauMessageCommand from "../messageCommand";
import MiauSlashCommand from "../slashCommand";
import { ChatInputCommandInteraction } from "discord.js";

export class MiauCommandResponse {
    private readonly bParams: (MiauSlashCommandParam | MiauMessageCommandParam)[] | null;

    constructor(
        command: MiauInteraction,
        private readonly context: ChatInputCommandInteraction
    ) {
        if (command instanceof MiauSlashCommand || command instanceof MiauMessageCommand) {
            this.bParams = command.builder.params;
        } else {
            this.bParams = null;
        }
    }

    public get<T extends SlashCommandParamType>(customId: string, asType?: T): MiauSlashCommandParamResponse<T> {
        if (!this.bParams) throw new Error("Este comando no tiene parámetros definidos.");

        const param = this.bParams.find(p => p.customId === customId) as MiauSlashCommandParam | undefined;
        if (!param) throw new Error(`Parámetro '${customId}' no está definido en el comando.`);

        const valueRaw = this.context.options.get(customId)?.value;
        const finalType = asType ?? param.type as T;

        if (valueRaw === undefined || valueRaw === null) {
            if (param.required) throw new Error(`El parámetro '${customId}' es obligatorio.`);
            return {
                customId: param.customId,
                name: param.name,
                type: param.type as T,
                description: param.description,
                required: param.required,
                value: undefined as any
            } as MiauSlashCommandParamResponse<T>;
        }

        const value = this.convertValue(valueRaw, finalType);
        this.validateValue(valueRaw, finalType);

        const response: Partial<MiauSlashCommandParamResponse<T>> = {
            customId: param.customId,
            name: param.name,
            type: param.type as T,
            description: param.description,
            required: param.required,
            value: value as any
        };

        if (this.isNumberType(finalType)) {
            Object.assign(response, {
                min: param.min,
                max: param.max,
                max_floating: param.max_floating
            });
        }

        if (this.isStringType(finalType)) {
            Object.assign(response, {
                min_len: param.min_len,
                max_len: param.max_len,
                choices: param.choices
            });
        }

        return response as MiauSlashCommandParamResponse<T>;
    }

    private readonly stringTypes = new Set<SlashCommandParamType>([
        "TEXT", "WORD", "LETTER",
        SlashParamTypes.TEXT, SlashParamTypes.WORD, SlashParamTypes.LETTER
    ]);

    private readonly numberTypes = new Set<SlashCommandParamType>(["NUMBER", "INTEGER", SlashParamTypes.NUMBER, SlashParamTypes.INTEGER]);

    private isStringType(type: SlashCommandParamType): boolean {
        return this.stringTypes.has(type);
    }

    private isNumberType(type: SlashCommandParamType): boolean {
        return this.numberTypes.has(type);
    }

    private convertValue(value: unknown, type: SlashCommandParamType): any {
        switch (type) {
            case "TEXT":
            case "WORD":
            case "LETTER":
            case SlashParamTypes.TEXT:
            case SlashParamTypes.WORD:
            case SlashParamTypes.LETTER:
                return String(value);
            case "INTEGER":
            case "NUMBER":
            case SlashParamTypes.INTEGER:
            case SlashParamTypes.NUMBER:
                return Number(value);
            case "BOOLEAN":
            case SlashParamTypes.BOOLEAN:
                return Boolean(value);
            default:
                return value;
        }
    }

    private validateValue(value: unknown, type: SlashCommandParamType): void {
        if ((type === "LETTER" || type === SlashParamTypes.LETTER) && String(value).length !== 1) {
            throw new Error(`Valor no válido para tipo 'letter': ${value}`);
        }

        if ((type === "INTEGER" || type === SlashParamTypes.INTEGER) && !Number.isInteger(Number(value))) {
            throw new Error(`Valor no válido para tipo 'integer': ${value}`);
        }

        if ((type === "NUMBER" || type === SlashParamTypes.NUMBER) && typeof value === 'number') {
            const [_, decimals] = String(value).split('.') ?? [];
            if (decimals && decimals.length > 6) {
                throw new Error(`El número tiene más decimales de lo permitido: ${value}`);
            }
        }
    }
}