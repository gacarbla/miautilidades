export interface MiauMessageCommandParam {
    customId: string
    alias: string
    type: 'word' | 'text' | 'number' | 'int' | 'mention' | 'channel' | 'usermention' | 'rolemention'
    description: string
    required: boolean
    choices?: string[]
    min?: number
    max?: number
    min_len?: number
    max_len?: number
}

export interface MiauMessageCommandParamResponse {
    type: 'word' | 'text' | 'number' | 'int' | 'mention' | 'channel' | 'usermention' | 'rolemention'
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