// types/slashCommands.ts
import {
    User, Role, GuildMember, GuildBasedChannel, Attachment,
} from "discord.js";
import { SlashParamTypes } from "../enum/interactions";
import { MiauSlashCommandParam } from "../interfaces/interaction";

// Extrae union de los "value" de choices [{name,value}]
export type ChoiceValueUnion<C> =
    C extends readonly (infer U)[] ? (U extends { value: infer V } ? V : never) : never;

// ¿Es un tipo de texto (string) de tu DSL?
export type IsTextLiteral<T> =
    T extends "LETTER" | "WORD" | "TEXT" ? true : false;

// ¿Es enum de texto?
export type IsTextEnum<T> =
    T extends SlashParamTypes ? (
        SlashParamTypes extends T ? false // si es el enum completo, no sabemos
        : T extends (typeof SlashParamTypes)["LETTER" | "WORD" | "TEXT"] ? true : false
    ) : false;

// Valor final por tipo propio (strings + enum). Para enum no-literal la inferencia puede ampliarse.
export type SlashParamValue<P extends MiauSlashCommandParam> =
    // TEXT/WORD/LETTER => string (con choices si existen)
    P["type"] extends "LETTER" | "WORD" | "TEXT"
    ? (P extends { choices: readonly any[] } ? ChoiceValueUnion<P["choices"]> & string : string)
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["LETTER" | "WORD" | "TEXT"]>
    ? (P extends { choices: readonly any[] } ? ChoiceValueUnion<P["choices"]> & string : string)
    // NUMBER/INTEGER
    : P["type"] extends "NUMBER" | "INTEGER"
    ? number
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["NUMBER" | "INTEGER"]>
    ? number
    // BOOLEAN
    : P["type"] extends "BOOLEAN"
    ? boolean
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["BOOLEAN"]>
    ? boolean
    // USER / MEMBER / ROLE / CHANNEL / MENTIONABLE / ATTACHMENT
    : P["type"] extends "USER" ? User
    : P["type"] extends "MEMBER" ? GuildMember
    : P["type"] extends "ROLE" ? Role
    : P["type"] extends "CHANNEL" ? GuildBasedChannel
    : P["type"] extends "MENTIONABLE" ? User | Role | GuildMember
    : P["type"] extends "ATTACHMENT" ? Attachment
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["USER"]>
    ? User
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["MEMBER"]>
    ? GuildMember
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["ROLE"]>
    ? Role
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["CHANNEL"]>
    ? GuildBasedChannel
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["MENTIONABLE"]>
    ? User | Role | GuildMember
    : P["type"] extends Extract<SlashParamTypes, (typeof SlashParamTypes)["ATTACHMENT"]>
    ? Attachment
    : never;

// Objeto params fuertemente tipado con opcionalidad por "required".
export type ParamsFrom<T extends Record<string, MiauSlashCommandParam>> = {
    [K in keyof T]:
    T[K]["required"] extends true
    ? SlashParamValue<T[K]>
    : SlashParamValue<T[K]> | undefined;
};
