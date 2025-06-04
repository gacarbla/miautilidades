export interface MiauClientEventsObject {
    bot?: {
        join: any[]|undefined;
        leave: any[]|undefined;
    };
    guild?: {
        nameUpdate: any[]|undefined;
        descriptionUpdate: any[]|undefined;
        otherUpdates: any[]|undefined;
        invite?: {
            added: any[]|undefined;
            removed: any[]|undefined;
            updated: any[]|undefined;
        }
        emoji?: {
            added: any[]|undefined;
            removed: any[]|undefined;
            updated: any[]|undefined;
        }
        sticker?: {
            added: any[]|undefined;
            removed: any[]|undefined;
            updated: any[]|undefined;
        }
        bot?: {
            newGuild: any[]|undefined;
            rejoinGuild: any[]|undefined;
            leaveGuild: any[]|undefined;
            ban: any[]|undefined;
            unban: any[]|undefined;
            restrict: any[]|undefined;
            unrestrict: any[]|undefined;
            newNotification: any[]|undefined;
        }
        members?: {
            join: any[]|undefined;
            leave: any[]|undefined;
            botJoin: any[]|undefined;
            botLeave: any[]|undefined;
            avatarUpdate: any[]|undefined;
            serverAvatarUpdate: any[]|undefined;
            nicknameUpdate: any[]|undefined;
            displayNameUpdate: any[]|undefined;
            usernameUpdate: any[]|undefined;
            giveRole: any[]|undefined;
            removeRole: any[]|undefined;
        }
        roles?: {
            create: any[]|undefined;
            update: any[]|undefined;
            delete: any[]|undefined;
        }
        channels?: {
            create: any[]|undefined;
            update: any[]|undefined;
            delete: any[]|undefined;
        }
        staff?: {
            add: any[]|undefined;
            remove: any[]|undefined;
            upgrade: any[]|undefined;
            downgrade: any[]|undefined;
            suspiciusActivity: any[]|undefined;
            goodJob: any[]|undefined;
        }
        discordAutomod?: {
            messageBlocked: any[]|undefined;
            usernameBlocked: any[]|undefined;
        }
        botAutomod?: {
            ia?: {
                enabled: any[]|undefined;
                disabled: any[]|undefined;
                messageBlocked: any[]|undefined;
                suspiciusMessage: any[]|undefined;
                suspiciusActivity: any[]|undefined;
            }
            enabled: any[]|undefined;
            disabled: any[]|undefined;
            suspiciusActivity: any[]|undefined;
        }
        webhooks?: {
            create: any[]|undefined;
            update: any[]|undefined;
            delete: any[]|undefined;
        }
        sanctions?: {
            ban: any[]|undefined;
            unban: any[]|undefined;
            warn: any[]|undefined;
            txtMute: any[]|undefined;
            vcMute: any[]|undefined;
            globalMute: any[]|undefined;
            txtUnmute: any[]|undefined;
            vcUnmute: any[]|undefined;
            globalUnmute: any[]|undefined;
            softban: any[]|undefined;
            kick: any[]|undefined;
            tempban: any[]|undefined;
            removeSanction: any[]|undefined;
        }
        moderation?: {
            messageDeleted: any[]|undefined;
            bulkMessageDeleted: any[]|undefined;
        }
    },
    users?: {
        profile?: {
            avatarUpdate: any[]|undefined;
            usernameUpdate: any[]|undefined;
            displayNameUpdate: any[]|undefined;
            nicknameUpdate: any[]|undefined;
            serverAvatarUpdate: any[]|undefined;
        },
        member?: {
            join: any[]|undefined;
            leave: any[]|undefined;
            giveRole: any[]|undefined;
            removeRole: any[]|undefined;
        },
        guildBan?: {
            banned: any[]|undefined;
            failedBan: any[]|undefined;
            unbanned: any[]|undefined;
        },
        guildKick?: {
            kicked: any[]|undefined;
            failedKick: any[]|undefined;
            joinAfterKick: any[]|undefined;
        },
        voice?: {
            join: any[]|undefined;
            leave: any[]|undefined;
            disconnect: any[]|undefined;
            move: any[]|undefined;
            moved: any[]|undefined;
            muted: any[]|undefined;
            unmuted: any[]|undefined;
            deafened: any[]|undefined;
            undeafened: any[]|undefined;
            serverMuted: any[]|undefined;
            serverUnmuted: any[]|undefined;
            serverDeafened: any[]|undefined;
            serverUndeafened: any[]|undefined;
            startVideo: any[]|undefined;
            endVideo: any[]|undefined;
            startStreaming: any[]|undefined;
            endStreaming: any[]|undefined;
        };
    };
    messages?: {
        created: any[]|undefined;
        deleted: any[]|undefined;
        edited: any[]|undefined;
    };
}

export interface MiauClientOptions {
    interactionsFolder: string
    indexedFileExtensions: string[]
    defaultPrefix: string
    regExpPrefix: RegExp
    replyToMention: boolean
    ignoredFolderNames?: string[]
    ignoredFileNames?: string[]
}