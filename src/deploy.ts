import 'dotenv/config';
//import { REST, Routes } from 'discord.js';
import MiauClient from './lib/models/client';

export async function deployCommands(client:MiauClient) {

    const slash = client.interactions.slashCommands.getAll().map(c => c.value.toJSON());
    const contextMenus = client.interactions.contextMenus.getAll().map(c => c.value.toJSON());

    const commands = [...slash, ...contextMenus];

    //const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    commands

    /*
    try {
        console.log('[🚀] Subiendo comandos a Discord...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands }
        );
        console.log('[✅] Comandos actualizados con éxito.');
    } catch (error) {
        console.error('[❌] Error actualizando comandos:', error);
    }
        */
}