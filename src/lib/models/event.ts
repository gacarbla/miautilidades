type MiauEventType =
    | "bot.join"
    | "bot.leave"
    | "users.joinGuild"
    | "users.leaveGuild"
    | "users.bannedFromGuild"
    | "users.kickedFromGuild"
    | "users.voice.join"
    | "users.voice.leave"
    | "users.voice.disconnect"
    | "users.voice.move"
    | "users.voice.moved"
    | "users.voice.muted"
    | "users.voice.unmuted"
    | "users.voice.deafened"
    | "users.voice.undeafened"
    | "users.voice.serverMuted"
    | "users.voice.serverUnmuted"
    | "users.voice.serverDeafened"
    | "users.voice.serverUndeafened"
    | "users.voice.startVideo"
    | "users.voice.endVideo"
    | "messages.created"
    | "messages.deleted"
    | "messages.edited";

interface MiauEventDefaultData {
    
    /**
     * Identificador único del evento.
     */
    customId: string
    
    /**
     * Especifica los triggers que activarán este evento.
     */
    triggersOn: MiauEventType[]
    
    /**
     * Este booleano indica si el evento se debe ejecutar múltiples veces en caso de que varios triggers lo accionen.
     */
    multipleTrigger: boolean
}

class MiauEvent {
    constructor(data:MiauEventDefaultData) {}
}