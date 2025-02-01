import { Client, ClientOptions } from "discord.js";
import Collection from "./collection";
import { MiauButton, MiauChannelSelect, MiauContextMenu, MiauMessageCommand, MiauRoleSelect, MiauSlashCommand, MiauStringSelect, MiauUserSelect } from "./interactions";
import Utils from "../utils";
import MiauModal from "./interactioners/modal";
import MiauAutocomplete from "./interactioners/autocomplete";

interface MiauClientOptions {
    interactionsFolder:string
    indexedFileExtensions:string[]
    defaultPrefix:string
    regExpPrefix:RegExp
    replyToMention:boolean
    ignoredFolderNames?:string[]
    ignoredFileNames?:string[]
}

interface MiauClientEventsObject {
    bot: {
        join: any[];
        leave: any[];
    };
    users: {
        joinGuild: any[];
        leaveGuild: any[];
        bannedFromGuild: any[];
        kickedFromGuild: any[];
        voice: {
            join: any[];
            leave: any[];
            disconnect: any[];
            move: any[];
            moved: any[];
            muted: any[];
            unmuted: any[];
            deafened: any[];
            undeafened: any[];
            serverMuted: any[];
            serverUnmuted: any[];
            serverDeafened: any[];
            serverUndeafened: any[];
            startVideo: any[];
            endVideo: any[];
        };
    };
    messages: {
        created: any[];
        deleted: any[];
        edited: any[];
    };
}

class MiauClient extends Client {
    private params:MiauClientOptions
    constructor(djs_params:ClientOptions, mjs_params:MiauClientOptions) {
        super(djs_params)
        this.params = mjs_params
    }

    events:MiauClientEventsObject = {
        bot: {
            join: [],
            leave: []
        },
        users: {
            joinGuild: [],
            leaveGuild: [],
            bannedFromGuild: [],
            kickedFromGuild: [],
            voice: {
                join: [],
                leave: [],
                disconnect: [],
                move: [],
                moved: [],
                muted: [],
                unmuted: [],
                deafened: [],
                undeafened: [],
                serverMuted: [],
                serverUnmuted: [],
                serverDeafened: [],
                serverUndeafened: [],
                startVideo: [],
                endVideo: []
            }
        },
        messages: {
            created: [],
            deleted: [],
            edited: []
        },
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

    utils = new Utils()

    load = async (): Promise<void> => {}
    refreshInteractions = async (): Promise<void> => {}
}

export default MiauClient