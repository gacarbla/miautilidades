import { GuildMember, Message, VoiceState, User, PartialMessage } from "discord.js";

export interface EventArgumentsMap {
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
    "messages.deleted": [Message | PartialMessage];
    "messages.edited": [Message, Message];
}

export interface MiauEventDefaultData {
    customId: string;
}