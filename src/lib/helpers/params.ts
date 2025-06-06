import client from "../..";
import { Role, User, GuildMember, GuildChannel } from "discord.js";

export class CommandParamsHelper {
    static verifyParamType(origin: "message" | "slashcommand", type: string, value: unknown): boolean {
        switch (origin) {
            case "message":
                return this.verifyMessageParam(type, value);
            case "slashcommand":
                return this.verifySlashParam(type, value);
            default:
                client.utils.console.error(["commandExecutionError"], `Origen de parámetro no reconocido: ${origin}`);
                throw new Error("Origen de parámetro no reconocido");
        }
    }

    private static verifyMessageParam(type: string, value: unknown): boolean {
        switch (type) {
            case "word":
                return typeof value === "string" && /^\w+$/.test(value);
            case "letter":
                return typeof value === "string" && /^[a-zA-Z]$/.test(value);
            case "text":
                return typeof value === "string";
            case "number":
            case "int":
                return typeof value === "number" && Number.isFinite(value);
            case "boolean":
                return typeof value === "boolean";
            case "mention":
            case "usermention":
            case "membermention":
                return typeof value === "string" && /^<@!?(\d+)>$/.test(value);
            case "channel":
                return typeof value === "string" && /^<#\d+>$/.test(value);
            case "rolemention":
                return typeof value === "string" && /^<@&\d+>$/.test(value);
            case "attachment":
                return typeof value === "object" && value !== null && "url" in (value as object);
            default:
                client.utils.console.error(["commandExecutionError"], `Tipo de parámetro no reconocido: ${type}`);
                throw new Error("Tipo de parámetro no reconocido");
        }
    }

    private static verifySlashParam(type: string, value: unknown): boolean {
        switch (type) {
            case "word":
                return typeof value === "string" && /^\w+$/.test(value);
            case "letter":
                return typeof value === "string" && /^[a-zA-Z]$/.test(value);
            case "text":
                return typeof value === "string";
            case "number":
            case "int":
                return typeof value === "number" && Number.isFinite(value);
            case "boolean":
                return typeof value === "boolean";
            case "mention":
            case "usermention":
                return value instanceof User;
            case "membermention":
                return value instanceof GuildMember;
            case "channel":
                return value instanceof GuildChannel;
            case "rolemention":
                return value instanceof Role;
            case "attachment":
                return typeof value === "object" && value !== null && "url" in (value as object); // O instanceof Attachment si lo usas
            default:
                client.utils.console.error(["commandExecutionError"], `Tipo de parámetro no reconocido: ${type}`);
                throw new Error("Tipo de parámetro no reconocido");
        }
    }
}
