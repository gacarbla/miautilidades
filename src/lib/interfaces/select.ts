import { SelectMenuType, StringSelectMenuOptionBuilder } from "discord.js"

export interface MiauSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    type: SelectMenuType,
    isRestricted: boolean,
    maxOptions?: number,
    minOptions?: number,
    options?: StringSelectMenuOptionBuilder[]
}

export interface MiauSelectBuildData {
    disabled?: boolean
    customLabel?: string,
    params?: string[]
}

export interface MiauUserSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    isRestricted: boolean,
    maxOptions?: number,
    minOptions?: number
}

export interface MiauChannelSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    isRestricted: boolean,
    maxOptions?: number,
    minOptions?: number
}

export interface MiauRoleSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    isRestricted: boolean,
    maxOptions?: number,
    minOptions?: number
}

export interface MiauMentionableSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    isRestricted: boolean,
    maxOptions?: number,
    minOptions?: number
}

export interface MiauStringSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    isRestricted: boolean,
    maxOptions?: number,
    minOptions?: number,
    options?: StringSelectMenuOptionBuilder[]
}