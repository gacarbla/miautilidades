// /src/index.js
import { GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MiauClient from './lib/models/client';
import Collection from './lib/models/collection';

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
        GatewayIntentBits.MessageContent
    ]
});

// Carga los archivos del bot en memoria
await client.load()

// Actualiza asíncronamente los comandos del bot seguún la configuración de settings.ts
client.refreshInteractions()

// Inicia el bot tras cargar todo lo oportuno
client.login(process.env.TOKEN);

export default client;