import { GuildMember, Message, VoiceState, User, PartialMessage } from "discord.js";

// Definición de los tipos de eventos

// Tipos de eventos admitidos
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

// Mapeo de eventos a sus parámetros correspondientes
interface EventArgumentsMap {
    "bot.join": [GuildMember];
    "bot.leave": [GuildMember];
    "users.joinGuild": [GuildMember];
    "users.leaveGuild": [GuildMember];
    "users.bannedFromGuild": [User, GuildMember];
    "users.kickedFromGuild": [User, GuildMember];
    "users.voice.join": [VoiceState, VoiceState];
    "users.voice.leave": [VoiceState, VoiceState];
    "users.voice.disconnect": [VoiceState, VoiceState];
    "users.voice.move": [VoiceState, VoiceState];
    "users.voice.moved": [VoiceState, VoiceState];
    "users.voice.muted": [VoiceState, VoiceState];
    "users.voice.unmuted": [VoiceState, VoiceState];
    "users.voice.deafened": [VoiceState, VoiceState];
    "users.voice.undeafened": [VoiceState, VoiceState];
    "users.voice.serverMuted": [VoiceState, VoiceState];
    "users.voice.serverUnmuted": [VoiceState, VoiceState];
    "users.voice.serverDeafened": [VoiceState, VoiceState];
    "users.voice.serverUndeafened": [VoiceState, VoiceState];
    "users.voice.startVideo": [VoiceState, VoiceState];
    "users.voice.endVideo": [VoiceState, VoiceState];
    "messages.created": [Message];
    "messages.deleted": [Message|PartialMessage];
    "messages.edited": [Message, Message];
}

// Estructura básica de los datos del evento
interface MiauEventDefaultData {
    customId: string;
}

// Clase del evento
export default class MiauEvent {
    private data: MiauEventDefaultData;
    private trigger: MiauEventType | undefined;
    private execution?: (...args: any[]) => Promise<void>;

    get id() {
        return this.data.customId;
    }

    get triggersOn() {
        return this.trigger;
    }

    constructor(data: MiauEventDefaultData) {
        this.data = data;
    }

    async execute(...args: any[]): Promise<void> {
        if (this.execution) {
            await this.execution(...args);
        }
    }

    async setExecution<T extends MiauEventType>(event: T, f: (...args: EventArgumentsMap[T]) => Promise<void>): Promise<void> {
        this.trigger = event;
        this.execution = (...args: any[]) => f(...(args as EventArgumentsMap[T]));
    }
}