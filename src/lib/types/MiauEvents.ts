export type MiauEventType =
    | "bot.join" | "bot.leave"
    | "users.joinGuild" | "users.leaveGuild" | "users.bannedFromGuild" | "users.kickedFromGuild"
    | "users.voice.join" | "users.voice.leave" | "users.voice.disconnect" | "users.voice.move" | "users.voice.moved"
    | "users.voice.muted" | "users.voice.unmuted" | "users.voice.deafened" | "users.voice.undeafened"
    | "users.voice.serverMuted" | "users.voice.serverUnmuted" | "users.voice.serverDeafened" | "users.voice.serverUndeafened"
    | "users.voice.startVideo" | "users.voice.endVideo"
    | "messages.created" | "messages.deleted" | "messages.edited";