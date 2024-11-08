import { Client, ClientOptions } from "discord.js";
import Collection from "./collection";
import { MiauButton, MiauChannelSelect, MiauContextMenu, MiauMessageCommand, MiauRoleSelect, MiauSlashCommand, MiauStringSelect, MiauUserSelect } from "./interactions";
import Utils from "../utils";
import MiauModal from "./interactions/modal";
import MiauAutocomplete from "./interactions/autocomplete";

class MiauClient extends Client {
    constructor(params:ClientOptions) {
        super(params)
    }

    events = {
        messageCreate: [],
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