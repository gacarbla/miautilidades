import { MessageParamTypes, SlashParamTypes } from "../enum/interactions";

export type MiauInteractionTypes =
    "message" |
    "interaction" |
    "slashCommand" |
    "userContextMenu" |
    "messageContextMenu" |
    "contextMenu" |
    "selectMenu" |
    "roleSelectMenu" |
    "userSelectMenu" |
    "channelSelectMenu" |
    "stringSelectMenu" |
    "mentionableSelectMenu" |
    "autocomplete" |
    "button" |
    "modal";

export type MessageParamType =
    | "LETTER"
    | "WORD"
    | "TEXT"
    | "NUMBER"
    | "INTEGER"
    | "USER"            // Mención y/o ID
    | "USERMENTION"     // Sólo mención
    | "ROLE"            // ... (Se repite estructura)
    | "ROLEMENTION"
    | "CHANNEL"
    | "CHANNELMENTION"
    | "MENTIONABLE"
    | "MENTIONABLEMENTION"
    | "MEMBER"
    | "MEMBERMENTION"
    | "BOOLEAN"
    | "ATTACHMENT"


export type SlashParamType =
    | "LETTER"
    | "WORD"
    | "TEXT"
    | "NUMBER"
    | "INTEGER"
    | "USER"
    | "MEMBER"
    | "ROLE"
    | "CHANNEL"
    | "MENTIONABLE"
    | "BOOLEAN"
    | "ATTACHMENT"

export type SlashCommandParamType = SlashParamType | SlashParamTypes
export type MessageCommandParamType = MessageParamTypes | MessageParamType

export type PreconditionMethod = "all" | "one" | "none";