export interface MiauMessageCommandParam {
    customId: string
    name: string
    type: 'word' | 'letter' | 'text' | 'number' | 'int' | 'mention' | 'channel' | 'usermention' | 'rolemention' | 'boolean'
    description: string
    required: boolean
    choices?: string[]
    min?: number
    max?: number
    min_len?: number
    max_len?: number
}

export interface MiauMessageCommandParamResponse {
    type: 'word' | 'text' | 'number' | 'int' | 'mention' | 'channel' | 'usermention' | 'rolemention' | 'boolean' | 'letter'
    required: boolean
    value: string | number | undefined
    choices?: string[]
}

export interface MiauMessageCommandDefaultData {
    name: string
    alias: string[]
    description: string
    isRestricted: boolean
}