import client from "../..";
import { Role, User, GuildMember, GuildChannel } from "discord.js";
import { MessageCommandParamType, SlashCommandParamType } from "../types/interactions";
import { MessageParamTypes, SlashParamTypes } from "../enum/interactions";

export class CommandParamsHelper {
    static verifyParamType(origin: "message", type: MessageCommandParamType, value: unknown): boolean;
    static verifyParamType(origin: "slashcommand", type: SlashCommandParamType, value: unknown): boolean;
    static verifyParamType(origin: "message" | "slashcommand", type: SlashCommandParamType | MessageCommandParamType, value: unknown): boolean {
        switch (origin) {
            case "message":
                return this.verifyMessageParam(type as MessageCommandParamType, value);
            case "slashcommand":
                return this.verifySlashParam(type as SlashCommandParamType, value);
            default:
                client.utils.console.error(["commandExecutionError"], `Origen de parámetro no reconocido: ${origin}`);
                throw new Error("Origen de parámetro no reconocido");
        }
    }


    private static verifyMessageParam(type: MessageCommandParamType, value: unknown): boolean {
        switch (type) {
            case "WORD":
            case MessageParamTypes.WORD:
                return typeof value === "string" && /^\w+$/.test(value);
            case "LETTER":
            case MessageParamTypes.LETTER:
                return typeof value === "string" && /^[a-zA-Z]$/.test(value);
            case "TEXT":
            case MessageParamTypes.TEXT:
                return typeof value === "string";
            case "NUMBER":
            case "INTEGER":
            case MessageParamTypes.NUMBER:
            case MessageParamTypes.INTEGER:
                return typeof value === "number" && Number.isFinite(value);
            case "BOOLEAN":
            case MessageParamTypes.BOOLEAN:
                // TODO: Mejor validador
                return typeof value === "boolean";
            case "MEMBERMENTION":
            case "USERMENTION":
            case MessageParamTypes.USERMENTION:
            // TODO: Terminar implementación de MemberMention
                return typeof value === "string" && /^<@!?(\d+)>$/.test(value);
            case "CHANNELMENTION":
            case MessageParamTypes.CHANNELMENTION:
                return typeof value === "string" && /^<#\d+>$/.test(value);
            case "ROLEMENTION":
            case MessageParamTypes.ROLEMENTION:
                return typeof value === "string" && /^<@&\d+>$/.test(value);
            case "ATTACHMENT":
            case MessageParamTypes.ATTACHMENT:
                return typeof value === "object" && value !== null && "url" in (value as object);
            // TODO: Hacer MentionableMention
            // TODO: Hacer captadores de IDs no menciones
            default:
                client.utils.console.error(["commandExecutionError"], `Tipo de parámetro no reconocido: ${type}`);
                throw new Error("Tipo de parámetro no reconocido");
        }
    }

    private static verifySlashParam(type: SlashCommandParamType, value: unknown): boolean {
        switch (type) {
            case "WORD":
            case SlashParamTypes.WORD:
                return typeof value === "string" && /^\w+$/.test(value);
            case "LETTER":
            case SlashParamTypes.LETTER:
                return typeof value === "string" && /^[a-zA-Z]$/.test(value);
            case "TEXT":
            case SlashParamTypes.TEXT:
                return typeof value === "string";
            case "NUMBER":
            case "INTEGER":
            case SlashParamTypes.NUMBER:
            case SlashParamTypes.INTEGER:
                return typeof value === "number" && Number.isFinite(value);
            case "BOOLEAN":
            case SlashParamTypes.BOOLEAN:
                return typeof value === "boolean";
            case "USER":
            case SlashParamTypes.USER:
                return value instanceof User;
            case "MEMBER":
            case SlashParamTypes.MEMBER:
                return value instanceof GuildMember;
            case "CHANNEL":
            case SlashParamTypes.CHANNEL:
                return value instanceof GuildChannel;
            case "ROLE":
            case SlashParamTypes.ROLE:
                return value instanceof Role;
            case "ATTACHMENT":
            case SlashParamTypes.ATTACHMENT:
                return typeof value === "object" && value !== null && "url" in (value as object); // O instanceof Attachment si lo usas
            case "MENTIONABLE":
            case SlashParamTypes.MENTIONABLE:
                return value instanceof GuildMember || value instanceof User || value instanceof Role
            default:
                client.utils.console.error(["commandExecutionError"], `Tipo de parámetro no reconocido: ${type}`);
                throw new Error("Tipo de parámetro no reconocido");
        }
    }

    static getDiscordType(type: string): number {
        switch (type) {
            case "word":
            case "letter":
            case "text":
                return 3; // STRING
            case "number":
                return 10; // NUMBER (decimal)
            case "int":
                return 4; // INTEGER
            case "boolean":
                return 5; // BOOLEAN
            case "mention":
            case "usermention":
                return 6; // USER
            case "membermention":
                return 6; // USER (Discord no distingue en options)
            case "rolemention":
                return 8; // ROLE
            case "channel":
                return 7; // CHANNEL
            case "attachment":
                return 11; // ATTACHMENT
            default:
                throw new Error(`Tipo "${type}" no reconocido por getDiscordType.`);
        }
    }

    static convertParamValue(origin: "message" | "slashcommand", type: string, raw: any): any {
        switch (origin) {
            case "message":
                return this.messageConvertParamValue(type, raw)
            case "slashcommand":
                return this.slashConvertParamValue(type, raw)
        }
    }

    private static slashConvertParamValue(type: string, raw: any): any {
        switch (type) {
            case "word":
            case "letter":
            case "text":
                return String(raw);

            case "number":
            case "int":
                return Number(raw);

            case "boolean":
                return Boolean(raw);

            case "mention":
            case "usermention":
            case "membermention":
                return raw; // Discord ya da un objeto User o GuildMember según el tipo

            case "rolemention":
            case "channel":
                return raw; // Discord da Role o Channel según corresponda

            case "attachment":
                return { url: raw.url, name: raw.name ?? undefined };

            default:
                throw new Error(`Tipo no reconocido en convertParamValue: ${type}`);
        }
    }

    private static messageConvertParamValue(type: string, raw: any): any {
        switch (type) {
            case "word":
            case "letter":
            case "text":
                return String(raw);

            case "number":
            case "int":
                return Number(raw);

            case "boolean":
                return Boolean(raw);

            case "mention":
            case "usermention":
            case "membermention":
                return raw; // Discord ya da un objeto User o GuildMember según el tipo

            case "rolemention":
            case "channel":
                return raw; // Discord da Role o Channel según corresponda

            case "attachment":
                return { url: raw.url, name: raw.name ?? undefined };

            default:
                throw new Error(`Tipo no reconocido en convertParamValue: ${type}`);
        }
    }
}
