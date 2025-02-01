// /src/index.js
import { GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import MiauClient from './lib/models/client';
import settings from './settings';

dotenv.config();

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

export default client;