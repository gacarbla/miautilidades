import { ChatInputCommandInteraction, Collection, EmbedBuilder, SlashCommandBuilder } from "discord.js";

/**
 * @typedef {Object} Data
 * @property {string} name Nombre del comando
 * @property {string[]} channels Canales permitidos
 * @property {string[]} blacklistedChannels Canales donde está prohibido el comando
 * @property {string[]} roles Roles con acceso al comando
 * @property {string[]} blacklistedRoles Roles prohibidos para el comando
 * @property {SlashCommandBuilder} builder
 */

export default class ChatInputCommand {
    
    builderVersion = 1

    /**
     * 
     * @param {Data} data 
     */
    constructor(data) {
        this.data = data;

        // Precondición: Verificar roles permitidos
        this.addPrecondition("Roles permitidos", (interaction) => {
            return !this.data.roles || this.data.roles.some(r => interaction.member.roles.cache.has(r));
        });

        // Precondición: Verificar roles en lista negra
        this.addPrecondition("Roles prohibidos", (interaction) => {
            return !this.data.blacklistedRoles || !this.data.blacklistedRoles.some(r => interaction.member.roles.cache.has(r));
        });

        // Precondición: Verificar canales permitidos
        this.addPrecondition("Canales permitidos", (interaction) => {
            return !this.data.channels || this.data.channels.includes(interaction.channelId);
        });

        // Precondición: Verificar canales en lista negra
        this.addPrecondition("Canales prohibidos", (interaction) => {
            return !this.data.blacklistedChannels || !this.data.blacklistedChannels.includes(interaction.channelId);
        });
    }

    preconditions = [];
    get builder() { return this.data.builder; }

    /**
     * @param {string} preconditionName
     * @param {function(ChatInputCommandInteraction): boolean} precondition
     */
    addPrecondition(preconditionName, precondition) {
        this.preconditions.push({ name: preconditionName, run: precondition });
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns 
     */
    checkPreconditions(interaction) {
        let success = [], failed = [];
        this.preconditions.forEach(p => {
            let passed = p.run(interaction);
            passed ? success.push(p.name) : failed.push(p.name);
        });
        if (failed.length > 0) return { allowed: false, success, failed };
        return { allowed: true, success, failed };
    }

    /**
     * 
     * @param {function(ChatInputCommandInteraction): Promise<void>} f
     */
    setExecution(f) {
        this.execution = f;
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const result = this.checkPreconditions(interaction);

        if (!result.allowed) {
            interaction.reply({
                content: "No cumples las condiciones para utilizar este comando.\n```\nCondiciones no cumplidas:\n - " + result.failed.join("\n - ") + "\n```",
                ephemeral: true
            });
        } else {
            try {
                await this.execution(interaction);
            } catch (error) {
                console.error(`Error durante la ejecución del comando "${this.data.name}":`, error);
                let embed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setDescription(error.message)
                    .setColor(0xed4245)
                try {
                    await interaction.reply({
                        ephemeral: true,
                        embeds: [embed]
                    })
                } catch {
                    await interaction.editReply({
                        content: ``,
                        ephemeral: true,
                        embeds: [embed]
                    })
                }
            }
        }
    }

    /**
     * Ejecución por defecto si no se asigna una personalizada
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execution(interaction) {
        interaction.reply({ content: "Este comando no se encuentra disponible.", ephemeral: true });
    }
}
