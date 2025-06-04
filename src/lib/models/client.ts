import { Client, ClientOptions } from "discord.js";
import Collection from "./collection";
import { MiauButton, MiauChannelSelect, MiauContextMenu, MiauMessageCommand, MiauRoleSelect, MiauSlashCommand, MiauStringSelect, MiauUserSelect } from "./interactions";
import Utils from "../utils";
import MiauModal from "./interactioners/modal";
import MiauAutocomplete from "./interactioners/autocomplete";
import settings from "../../settings";
import { MiauClientEventsObject, MiauClientOptions } from "../interfaces/client";

class MiauClient extends Client {
    private params: MiauClientOptions
    public utils: Utils = new Utils()
    constructor(djs_params: ClientOptions, mjs_params: MiauClientOptions) {
        super(djs_params)
        console.log("MiauClient iniciado")
        this.params = mjs_params
    }

    events: MiauClientEventsObject = {
        bot: { join: [], leave: [] },
        guild: {
            nameUpdate: [],
            descriptionUpdate: [],
            otherUpdates: [],
            invite: { added: [], removed: [], updated: [] },
            emoji: { added: [], removed: [], updated: [] },
            sticker: { added: [], removed: [], updated: [] },
            bot: {
                newGuild: [], rejoinGuild: [], leaveGuild: [],
                ban: [], unban: [], restrict: [], unrestrict: [],
                newNotification: []
            },
            members: {
                join: [], leave: [], botJoin: [], botLeave: [],
                avatarUpdate: [], serverAvatarUpdate: [],
                nicknameUpdate: [], displayNameUpdate: [],
                usernameUpdate: [], giveRole: [], removeRole: []
            },
            roles: { create: [], update: [], delete: [] },
            channels: { create: [], update: [], delete: [] },
            staff: {
                add: [], remove: [], upgrade: [], downgrade: [],
                suspiciusActivity: [], goodJob: []
            },
            discordAutomod: { messageBlocked: [], usernameBlocked: [] },
            botAutomod: {
                ia: {
                    enabled: [], disabled: [],
                    messageBlocked: [], suspiciusMessage: [],
                    suspiciusActivity: []
                },
                enabled: [], disabled: [], suspiciusActivity: []
            },
            webhooks: { create: [], update: [], delete: [] },
            sanctions: {
                ban: [], unban: [], warn: [], txtMute: [], vcMute: [], globalMute: [],
                txtUnmute: [], vcUnmute: [], globalUnmute: [],
                softban: [], kick: [], tempban: [], removeSanction: []
            },
            moderation: { messageDeleted: [], bulkMessageDeleted: [] }
        },
        users: {
            profile: {
                avatarUpdate: [], usernameUpdate: [],
                displayNameUpdate: [], nicknameUpdate: [],
                serverAvatarUpdate: []
            },
            member: { join: [], leave: [], giveRole: [], removeRole: [] },
            guildBan: { banned: [], failedBan: [], unbanned: [] },
            guildKick: { kicked: [], failedKick: [], joinAfterKick: [] },
            voice: {
                join: [], leave: [], disconnect: [], move: [], moved: [],
                muted: [], unmuted: [], deafened: [], undeafened: [],
                serverMuted: [], serverUnmuted: [],
                serverDeafened: [], serverUndeafened: [],
                startVideo: [], endVideo: [],
                startStreaming: [], endStreaming: []
            }
        },
        messages: { created: [], deleted: [], edited: [] }
    }

    interactions = {
        message: new Collection<MiauMessageCommand>(),
        slashCommands: new Collection<MiauSlashCommand>(),
        contextMenus: new Collection<MiauContextMenu>(),
        buttons: new Collection<MiauButton>(),
        modals: new Collection<MiauModal>(),
        stringSelects: new Collection<MiauStringSelect>(),
        roleSelects: new Collection<MiauRoleSelect>(),
        channelSelects: new Collection<MiauChannelSelect>(),
        userSelects: new Collection<MiauUserSelect>(),
        autocompletes: new Collection<MiauAutocomplete>()
    }

    async build(token: string): Promise<void> {
        await this.load()
        settings.refreshInteractions ? this.refreshInteractions() : undefined
        console.log("MiauClient configurado")
        this.login(token)
    }

    load = async (): Promise<void> => {
        this.on("ready", () => {
            console.log(`[✅] Cliente iniciado como ${this.user?.tag}`);
        });

        this.on("interactionCreate", async (interaction) => {
            if (interaction.isChatInputCommand()) {
                const command = this.interactions.slashCommands.get(interaction.commandName);
                if (command) await command.execute(interaction);
            }
        });

        this.on("messageCreate", msg => {
            this.events.messages?.created?.forEach(e => e.execute(msg));
        });

        this.on("messageDelete", msg => {
            this.events.messages?.deleted?.forEach(e => e.execute(msg));
        });

        this.on("messageUpdate", (oldMsg, newMsg) => {
            this.events.messages?.edited?.forEach(e => e.execute(oldMsg, newMsg));
        });

        this.on("guildCreate", guild => {
            this.events.bot?.join?.forEach(e => e.execute(guild));
        });

        this.on("guildDelete", guild => {
            this.events.bot?.leave?.forEach(e => e.execute(guild));
        });

        this.on("guildBanAdd", ban => {
            this.events.users?.guildBan?.banned?.forEach(e => e.execute(ban));
        });

        this.on("guildBanRemove", ban => {
            this.events.users?.guildBan?.unbanned?.forEach(e => e.execute(ban));
        });

        this.on("guildMemberAdd", member => {
            this.events.users?.member?.join?.forEach(e => e.execute(member));
        });

        this.on("guildMemberRemove", member => {
            this.events.users?.member?.leave?.forEach(e => e.execute(member));
        });

        this.on("autoModerationActionExecution", (execution) => {
            this.events.guild?.discordAutomod?.messageBlocked?.forEach(e => e.execute(execution));
        });

        this.on("voiceStateUpdate", (oldState, newState) => {
            const member = newState.member ?? oldState.member;
            if (!member) return;

            const o = oldState;
            const n = newState;

            if (!o.channel && n.channel) this.events.users?.voice?.join?.forEach(e => e.execute(member, n.channel));
            if (o.channel && !n.channel) this.events.users?.voice?.leave?.forEach(e => e.execute(member, o.channel));
            if (o.channel && n.channel && o.channel.id !== n.channel.id) {
                this.events.users?.voice?.move?.forEach(e => e.execute(member, o.channel, n.channel));
                this.events.users?.voice?.moved?.forEach(e => e.execute(member, o.channel, n.channel));
            }
            if (o.deaf !== n.deaf) {
                const type = n.deaf ? "deafened" : "undeafened";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.mute !== n.mute) {
                const type = n.mute ? "muted" : "unmuted";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.serverDeaf !== n.serverDeaf) {
                const type = n.serverDeaf ? "serverDeafened" : "serverUndeafened";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.serverMute !== n.serverMute) {
                const type = n.serverMute ? "serverMuted" : "serverUnmuted";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.selfVideo !== n.selfVideo) {
                const type = n.selfVideo ? "startVideo" : "endVideo";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
            if (o.streaming !== n.streaming) {
                const type = n.streaming ? "startStreaming" : "endStreaming";
                this.events.users?.voice?.[type]?.forEach(e => e.execute(member));
            }
        });
    }

    refreshInteractions = async (): Promise<void> => {

    }
}

export default MiauClient