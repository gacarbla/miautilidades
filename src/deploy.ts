import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import MiauClient from './lib/models/client';

export async function deployCommands(client:MiauClient) {

    const commands = client.interactions.getDeployJSON()
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

    try {
        client.utils.console.info(["interactionBuildLog"], 'Subiendo comandos a Discord...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands }
        );
        client.utils.console.success(["interactionBuildLog"], 'Comandos actualizados con éxito.');
    } catch (error) {
        client.utils.console.log(["interactionBuildLog"], 'Error actualizando comandos: '+error);
    }
}