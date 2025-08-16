// Ajusta la ruta:

import MiauEvent from "../models/event";

// Hoja: lista de manejadores o undefined
export type EventList = MiauEvent[] | undefined;

// Mapped type para bloques simples: claves -> MiauEvent[] | undefined, y el bloque puede omitirse
type Handlers<K extends string> = Partial<Record<K, EventList>>;

// ── Uniones de claves por bloque (útil para autocompletado y reutilización)
export type BotTopKeys = "join" | "leave";

export type GuildInviteKeys = "added" | "removed" | "updated";
export type GuildEmojiKeys = "added" | "removed" | "updated";
export type GuildStickerKeys = "added" | "removed" | "updated";
export type GuildBotKeys = "newGuild" | "rejoinGuild" | "leaveGuild" | "ban" | "unban" | "restrict" | "unrestrict" | "newNotification";
export type GuildMemberKeys = "join" | "leave" | "botJoin" | "botLeave" | "avatarUpdate" | "serverAvatarUpdate" | "nicknameUpdate" | "displayNameUpdate" | "usernameUpdate" | "giveRole" | "removeRole";
export type GuildRoleKeys = "create" | "update" | "delete";
export type GuildChannelKeys = "create" | "update" | "delete";
export type GuildStaffKeys = "add" | "remove" | "upgrade" | "downgrade" | "suspiciusActivity" | "goodJob";
export type GuildDiscordAutomodKeys = "messageBlocked" | "usernameBlocked";
export type GuildBotAutomodIAKeys = "enabled" | "disabled" | "messageBlocked" | "suspiciusMessage" | "suspiciusActivity";
export type GuildBotAutomodKeys = "enabled" | "disabled" | "suspiciusActivity";
export type GuildWebhookKeys = "create" | "update" | "delete";
export type GuildSanctionKeys = "ban" | "unban" | "warn" | "txtMute" | "vcMute" | "globalMute" | "txtUnmute" | "vcUnmute" | "globalUnmute" | "softban" | "kick" | "tempban" | "removeSanction";
export type GuildModerationKeys = "messageDeleted" | "bulkMessageDeleted";

export type UserProfileKeys = "avatarUpdate" | "usernameUpdate" | "displayNameUpdate" | "nicknameUpdate" | "serverAvatarUpdate";
export type UserMemberKeys = "join" | "leave" | "giveRole" | "removeRole";
export type UserGuildBanKeys = "banned" | "failedBan" | "unbanned";
export type UserGuildKickKeys = "kicked" | "failedKick" | "joinAfterKick";
export type UserVoiceKeys = "join" | "leave" | "disconnect" | "move" | "moved" | "muted" | "unmuted" | "deafened" | "undeafened" | "serverMuted" | "serverUnmuted" | "serverDeafened" | "serverUndeafened" | "startVideo" | "endVideo" | "startStreaming" | "endStreaming";

export type MessageKeys = "created" | "deleted" | "edited";

// ── Bloques tipados

export interface MiauClientEventsObject {
    bot?: Handlers<BotTopKeys>;

    guild?: {
        nameUpdate?: EventList;
        descriptionUpdate?: EventList;
        otherUpdates?: EventList;

        invite?: Handlers<GuildInviteKeys>;
        emoji?: Handlers<GuildEmojiKeys>;
        sticker?: Handlers<GuildStickerKeys>;

        bot?: Handlers<GuildBotKeys>;

        members?: Handlers<GuildMemberKeys>;

        roles?: Handlers<GuildRoleKeys>;
        channels?: Handlers<GuildChannelKeys>;
        staff?: Handlers<GuildStaffKeys>;

        discordAutomod?: Handlers<GuildDiscordAutomodKeys>;

        botAutomod?: {
            ia?: Handlers<GuildBotAutomodIAKeys>;
            // Hojas directas del bloque botAutomod:
            enabled?: EventList;
            disabled?: EventList;
            suspiciusActivity?: EventList;
        };

        webhooks?: Handlers<GuildWebhookKeys>;
        sanctions?: Handlers<GuildSanctionKeys>;
        moderation?: Handlers<GuildModerationKeys>;
    };

    users?: {
        profile?: Handlers<UserProfileKeys>;
        member?: Handlers<UserMemberKeys>;
        guildBan?: Handlers<UserGuildBanKeys>;
        guildKick?: Handlers<UserGuildKickKeys>;
        voice?: Handlers<UserVoiceKeys>;
    };

    messages?: Handlers<MessageKeys>;
}

// Opciones (sin cambios)
export interface MiauClientOptions {
    interactionsFolder: string;
    eventsFolder: string;
    indexedFileExtensions: string[];
    defaultPrefix: string;
    regExpPrefix: RegExp;
    replyToMention: boolean;
    ignoredFolderNames?: string[];
    ignoredFileNames?: string[];
}
