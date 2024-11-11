import {
    ContextMenuCommandType,
    TextInputBuilder
} from "discord.js"
export interface MiauSlashCommandDefaultData {
    name: string,
    description: string,
    isRestricted: boolean,
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