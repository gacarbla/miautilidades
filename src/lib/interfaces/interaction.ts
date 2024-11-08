import {
    ButtonStyle,
    ContextMenuCommandType,
    PermissionsBitField,
    SelectMenuType,
    StringSelectMenuOptionBuilder,
    TextInputBuilder
} from "discord.js"

export interface MiauButtonDefaultData {
    name: string,
    label: string,
    customId: string,
    style: ButtonStyle,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField
}

export interface MiauSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    type: SelectMenuType,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField,
    maxOptions: number,
    minOptions: number,
    options?: StringSelectMenuOptionBuilder[]
}

export interface MiauUserSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    type: SelectMenuType,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField,
    maxOptions: number,
    minOptions: number
}

export interface MiauChannelSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    type: SelectMenuType,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField,
    maxOptions: number,
    minOptions: number
}

export interface MiauRoleSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    type: SelectMenuType,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField,
    maxOptions: number,
    minOptions: number
}

export interface MiauMentionableSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    type: SelectMenuType,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField,
    maxOptions: number,
    minOptions: number
}

export interface MiauStringSelectDefaultData {
    name: string,
    label: string,
    customId: string,
    type: SelectMenuType,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField,
    maxOptions: number,
    minOptions: number,
    options: StringSelectMenuOptionBuilder[]
}

export interface MiauSlashCommandDefaultData {
    name: string,
    description: string,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField
}

export interface MiauMessageCommandDefaultData {
    name: string,
    alias: string[],
    description: string,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField
}

export interface MiauModalDefaultData {
    name: string,
    title: string,
    customId: string,
    description: string,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField,
    inputs: TextInputBuilder[]
}

export interface MiauContextMenuDefaultData {
    name: string,
    label: string,
    description: string,
    isRestricted: boolean,
    botPermissions: PermissionsBitField,
    userPermissions: PermissionsBitField,
    type: ContextMenuCommandType
}