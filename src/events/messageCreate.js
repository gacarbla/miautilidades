import { Message } from "discord.js";
import client from "../index.js";

export const name = "messageCreate"
export const once = false;

/**
 * @param {Message} message
 */
export async function execute(message) {
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
        message.reply({content: 'Miau!'})
    }
}