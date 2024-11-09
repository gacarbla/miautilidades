export interface MiauMessageCommandParam {
    name: string,
    type: 'word' | 'text' | 'number' | 'int' | 'mention' | 'channel' | 'usermention' | 'rolemention'
    description: string
    required: boolean
    choices?: string[]
    min?: number
    max?: number
    min_len?: number
    max_len?: number
}