// /src/index.js
import { GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import MiauClient from './lib/models/client';
import settings from './settings';

dotenv.config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new MiauClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences
    ],
    partials: [
        Partials.Message,
        Partials.GuildMember,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildScheduledEvent
    ]
}, {
    interactionsFolder: path.join(__dirname, 'interactions'),
    indexedFileExtensions: ['*.js'],
    defaultPrefix: settings.defaultPrefix,
    regExpPrefix: settings.regExpPrefix,
    replyToMention: true
});

// Carga los archivos del bot en memoria
await client.load()

// Actualiza asíncronamente los comandos del bot seguún la configuración de settings.ts
settings.refreshInteractions?client.refreshInteractions():undefined

// Inicia el bot tras cargar todo lo oportuno
client.login(process.env.TOKEN);

export default client;