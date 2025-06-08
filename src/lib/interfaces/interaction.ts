import {
    Attachment,
    ContextMenuCommandType,
    GuildChannel,
    GuildMember,
    Role,
    TextInputBuilder,
    User
} from "discord.js"
import { SlashCommandParamType } from "../types/interactions"
import { SlashParamTypes } from "../enum/interactions"
export interface MiauSlashCommandDefaultData {
    name: string,
    description: string,
    isRestricted: boolean,
}

export interface MiauSlashCommandParam {
    customId: string
    name: string
    type: SlashCommandParamType
    description: string
    required: boolean
    choices?: string[]
    min?: number
    max?: number
    min_len?: number
    max_len?: number
    max_floating?: number
}

export interface MiauSlashCommandResponseData {
    name: string,
    description: string,
    isRestricted: boolean,
    subcommand?: string,
    subcommandGroup?: string,
    params: MiauSlashCommandParamResponse[]
}

/*
export interface MiauSlashCommandParamResponse<T = unknown> {
    customId: string;
    name: string;
    type: T;
    description: string;
    required: boolean;
    choices?: string[];
    min?: number;
    max?: number;
    min_len?: number;
    max_len?: number;
    max_floating?: number;
    value:
    | string
    | number
    | boolean
    | User
    | GuildMember
    | GuildChannel
    | Role
    | Attachment
    | undefined;
}
*/

export interface MiauSlashCommandParamResponse<T extends SlashCommandParamType = SlashCommandParamType> {
    customId: string;
    name: string;
    type: T;
    description: string;
    required: boolean;

    min?:           T extends 'number'  | 'integer' |               SlashParamTypes.NUMBER  |   SlashParamTypes.INTEGER                             ? number : never;
    max?:           T extends 'number'  | 'integer' |               SlashParamTypes.NUMBER  |   SlashParamTypes.INTEGER                             ? number : never;
    choices?:       T extends 'text'    | 'word'    | 'letter' |    SlashParamTypes.TEXT    |   SlashParamTypes.WORD    | SlashParamTypes.LETTER    ? string[] : never;
    min_len?:       T extends 'text'    | 'word'    | 'letter' |    SlashParamTypes.TEXT    |   SlashParamTypes.WORD    | SlashParamTypes.LETTER    ? number : never;
    max_len?:       T extends 'text'    | 'word'    | 'letter' |    SlashParamTypes.TEXT    |   SlashParamTypes.WORD    | SlashParamTypes.LETTER    ? number : never;
    max_floating?:  T extends 'number'                                                                                                              ? number : never;

    value: T extends 'boolean' | SlashParamTypes.BOOLEAN ? boolean :
    T extends   'number'      | 'integer' |               SlashParamTypes.NUMBER            |   SlashParamTypes.INTEGER                             ? number :
    T extends   'text'        | 'word'    | 'letter'  |   SlashParamTypes.TEXT              |   SlashParamTypes.WORD    | SlashParamTypes.LETTER    ? string :
    T extends   'user'        |                           SlashParamTypes.USER                                                                      ? User :
    T extends   'channel'     |                           SlashParamTypes.CHANNEL                                                                   ? GuildChannel :
    T extends   'role'        |                           SlashParamTypes.ROLE                                                                      ? Role :
    T extends   'mentionable' |                           SlashParamTypes.MENTIONABLE                                                               ? User | Role :
    T extends   'attachment'  |                           SlashParamTypes.ATTACHMENT                                                                ? Attachment :
    T extends   'member'      |                           SlashParamTypes.MEMBER                                                                    ? GuildMember :
    unknown;
}


export interface MiauModalDefaultData {
    name: string,
    title: string,
    customId: string,
    description: string,
    isRestricted: boolean,
    inputs: TextInputBuilder[]
}

export interface MiauContextMenuDefaultData {
    name: string,
    label: string,
    description: string,
    isRestricted: boolean,
    type: ContextMenuCommandType
}