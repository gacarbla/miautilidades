import { MiauEventType } from "../types/MiauEvents";

const ALIAS: Record<string, MiauEventType> = {
    // messages
    "message.create": "messages.created",
    "messages.create": "messages.created",
    "message.delete": "messages.deleted",
    "messages.delete": "messages.deleted",
    "message.remove": "messages.deleted",
    "messages.remove": "messages.deleted",
    "message.update": "messages.edited",
    "messages.update": "messages.edited",
    "message.edit": "messages.edited",
    "messages.edit": "messages.edited",
    // voice (algunos alias comunes)
    "users.voice.switch": "users.voice.move",
    "users.voice.channelMove": "users.voice.move",
    "users.voice.dc": "users.voice.disconnect",
};

const CANONICAL = new Set<MiauEventType>([
    "bot.join", "bot.leave",
    "users.joinGuild", "users.leaveGuild", "users.bannedFromGuild", "users.kickedFromGuild",
    "users.voice.join", "users.voice.leave", "users.voice.disconnect", "users.voice.move", "users.voice.moved",
    "users.voice.muted", "users.voice.unmuted", "users.voice.deafened", "users.voice.undeafened",
    "users.voice.serverMuted", "users.voice.serverUnmuted", "users.voice.serverDeafened", "users.voice.serverUndeafened",
    "users.voice.startVideo", "users.voice.endVideo",
    "messages.created", "messages.deleted", "messages.edited",
]);

/** Devuelve la ruta canónica o null si no es reconocida. */
export function normalizeEventType(input: string): MiauEventType | null {
    const key = input.trim().replace(/\s+/g, "").toString();
    if (ALIAS[key]) return ALIAS[key];
    // singular → plural para "message.*"
    if (key.startsWith("message.")) {
        const rest = key.slice("message.".length);
        const maybe = `messages.${rest}` as MiauEventType;
        if (CANONICAL.has(maybe)) return maybe;
    }
    return CANONICAL.has(key as MiauEventType) ? (key as MiauEventType) : null;
}
