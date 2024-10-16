// /src/deploy-commands.js
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para cargar comandos desde un directorio dado
const loadCommands = (commandsPath) => {
    return new Promise(async (resolve, reject) => {
        const commands = [];
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = await import(`file://${filePath}`);
            commands.push(command.default.data.toJSON());
        }
        resolve(commands);
    })
};

// Leer todos los archivos de comandos de barra
const commandsPath = path.join(__dirname, 'commands');
const slashCommands = await loadCommands(commandsPath);

// Leer todos los archivos de comandos de menú contextual
const contextMenuPath = path.join(__dirname, 'contextMenu');
const contextMenuCommands = await loadCommands(contextMenuPath);

// Combinar todos los comandos
const allCommands = [...slashCommands, ...contextMenuCommands];

// Inicializar REST
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Registrar los comandos
(async () => {
    try {
        console.log(`Started refreshing ${allCommands.length} application (/) and Context Menu commands.`);

        // Registrar comandos globalmente
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: allCommands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) and Context Menu commands.`);
    } catch (error) {
        console.error(error);
    }
})();
