import { Message } from "discord.js";
import client from "../index.js";

export const name = "messageCreate"
export const once = false;

/**
 * @param {Message} message
 */
export async function execute(message) {
    if (!['790289803219566633', "1071826692764598302"].includes(message.guildId)) return
    const events = client.msgEvents.map(e => e.data.name)
    events.forEach(e => {
        let event = client.msgEvents.get(e)
        if (!event) {
            console.error("Imposible cargar el evento")
        } else if (event.precondition(message)) {
            event.execute(message)
        }
    });
    if (message.content.startsWith('gw!')) {
        
        const commandname = message.content.trim().split(" ")[0].slice(3)
        var command = client.msgCommands.get(commandname)
        if (command) {
            command.execute(message)
        } else {
            let cmds = client.msgCommands.filter(c => c.data.alias.includes(commandname)).map(m=>m.execute)
            if (cmds.length > 0) cmds[0](message)
        }
    }
}