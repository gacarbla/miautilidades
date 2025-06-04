import client from "../..";

export class CommandParamsHelper {
    static verifyParamType(type: string, value: unknown): boolean {
        switch (type) {
            case "word":
            case "letter":
            case "text":
                return typeof value === "string";
            case "number":
            case "int":
                return typeof value === "number";
            case "boolean":
                return typeof value === "boolean";
            case "mention":
            case "usermention":
            case "membermention":
            case "channel":
            case "rolemention":
                return typeof value === "string" && /^<@!?|<#|<@&/.test(value); // muy básico
            case "attachment":
                return typeof value === "object" && "url" in (value as object);
            default:
                client.utils.console.error(["commandExecutionError"], `Tipo de parámetro no reconocido: ${type}`)
                throw new Error("Tipo de parámetro no reconocido");
        }
    }
}