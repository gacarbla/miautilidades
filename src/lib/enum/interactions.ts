export enum MessageParamTypes {
    LETTER,
    WORD,
    TEXT,
    NUMBER,
    INTEGER,
    USER,           // Mención y/o ID
    USERMENTION,    // Sólo mención
    ROLE,           // ... (Se repite estructura)
    ROLEMENTION,
    CHANNEL,
    CHANNELMENTION,
    MENTIONABLE,
    MENTIONABLEMENTION,
    BOOLEAN,
    ATTACHMENT
}

export enum SlashParamTypes {
    LETTER,
    WORD,
    TEXT,
    NUMBER,
    INTEGER,
    USER,
    MEMBER,
    ROLE,
    CHANNEL,
    MENTIONABLE,
    BOOLEAN,
    ATTACHMENT
}