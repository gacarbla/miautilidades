import {
    ContextMenuCommandType,
    TextInputBuilder
} from "discord.js"
export interface MiauSlashCommandDefaultData {
    name: string,
    description: string,
    isRestricted: boolean,
}

export interface MiauSlashCommandParam {
    customId: string
    name: string
    type: 'word' | 'text' | 'number' | 'int' | 'mention' | 'channel' | 'usermention' | 'rolemention' | 'letter' | 'boolean'
    description: string
    required: boolean
    choices?: string[]
    min?: number
    max?: number
    min_len?: number
    max_len?: number
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