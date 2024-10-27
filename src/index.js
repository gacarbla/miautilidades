// /src/index.js
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.msgCommands = new Collection();
client.msgEvents = new Collection();
client.contextMenus = new Collection();

// Función para cargar módulos asíncronamente
async function loadModules() {
    // Cargar comandos slash
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const commandfile = await import(`file://${filePath}`);
        const command = commandfile.default
        if (command.builderVersion == 1) {
            client.commands.set(command.data.name, command);
        } else if (command.builderVersion == 2) {
            client.commands.set(command.name, command);
        }
    }

    // Cargar comandos de mensaje
    const messageCommandsPath = path.join(__dirname, 'message', 'commands');
    const messageCommandFiles = fs.readdirSync(messageCommandsPath).filter(file => file.endsWith('.js'));

    for (const file of messageCommandFiles) {
        const filePath = path.join(messageCommandsPath, file);
        const command = await import(`file://${filePath}`);
        client.msgCommands.set(command.default.data.name, command.default);
    }

    // Cargar eventos de mensaje
    const messageEventsPath = path.join(__dirname, 'message', 'events');
    const messageEventsFiles = fs.readdirSync(messageEventsPath).filter(file => file.endsWith('.js'));

    for (const file of messageEventsFiles) {
        const filePath = path.join(messageEventsPath, file);
        const event = await import(`file://${filePath}`);
        client.msgEvents.set(event.default.data.name, event.default);
    }

    const contextMenusPath = path.join(__dirname, 'contextMenu');
    const contextMenusFiles = fs.readdirSync(contextMenusPath).filter(file => file.endsWith('.js'));

    for (const file of contextMenusFiles) {
        const filePath = path.join(contextMenusPath, file);
        const menu = await import(`file://${filePath}`);
        client.contextMenus.set(menu.default.data.name, menu.default)
    }

    // Cargar eventos del cliente
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = await import(`file://${filePath}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

// Cargar módulos y luego iniciar el bot
loadModules().then(() => {
    client.login(process.env.TOKEN);
}).catch(console.error);

export default client;
