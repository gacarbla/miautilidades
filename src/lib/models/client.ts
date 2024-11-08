import { Client, ClientOptions } from "discord.js";
import Collection from "./collection";
import { MiauSlashCommand } from "./interactions";
import Utils from "../utils";

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
        message: [],
        slashCommands: new Collection<MiauSlashCommand>(),
        contextMenus: [],
        buttons: [],
        modals: [],
        stringSelect: [],
        roleSelect: [],
        channelSelect: [],
        userSelect: []
    }

    utils = new Utils()

    load = async (): Promise<void> => {}
    refreshInteractions = async (): Promise<void> => {}
}

export default MiauClient