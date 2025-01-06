import {
    Attachment,
    ContextMenuCommandType,
    GuildChannel,
    GuildMember,
    Role,
    TextInputBuilder,
    User
} from "discord.js"
export interface MiauSlashCommandDefaultData {
    name: string,
    description: string,
    isRestricted: boolean,
}

export interface MiauSlashCommandParam {
    customId: string
    name: string
    type: 'word' | 'text' | 'number' | 'int' | 'mention' | 'channel' | 'usermention' | 'rolemention' | 'letter' | 'boolean' | 'attachment' | 'membermention'
    description: string
    required: boolean
    choices?: string[]
    min?: number
    max?: number
    min_len?: number
    max_len?: number
    max_floating?: number
}

export interface MiauSlashCommandParamResponse {
    type: 'word' | 'text' | 'number' | 'int' | 'mention' | 'channel' | 'usermention' | 'rolemention' | 'letter' | 'boolean' | 'attachment' | 'membermention';
    choices?: string[];
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