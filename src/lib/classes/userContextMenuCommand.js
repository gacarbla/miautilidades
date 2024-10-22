import { ContextMenuCommandInteraction, Collection, ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from "discord.js";

/**
 * @typedef {Object} Data
 * @property {string} name Nombre del comando
 * @property {string[]} channels Canales en los que está permitido utilizar el comando
 * @property {string[]} blacklistedChannels Canales en los que no está permitido utilizar el comando
 * @property {string[]} roles Roles con acceso al comando
 * @property {string[]} blacklistedRoles Roles sin acceso al comando
 * @property {string[]} targetUser ID del autor del mensaje para verificar si puede ejecutar el comando
 * @property {ContextMenuCommandBuilder} builder
 */

export default class UserContextMenuCommand {
    /**
     * 
     * @param {Data} data 
     */
    constructor(data) {
        this.data = data;
        this.preconditions = new Collection();

        this.addPrecondition("AllowedChannels", (interaction) => this.checkAllowedChannels(interaction));
        this.addPrecondition("BlacklistedChannels", (interaction) => this.checkBlacklistedChannels(interaction));
        this.addPrecondition("AllowedRoles", (interaction) => this.checkAllowedRoles(interaction));
        this.addPrecondition("BlacklistedRoles", (interaction) => this.checkBlacklistedRoles(interaction));
        this.addPrecondition("TargetUser", (interaction) => this.checkTargetUser(interaction));
    }

    data = {};
    preconditions = new Collection();

    get builder() {
        return this.data.builder;
    }

    /**
     * Añade una precondición personalizada
     * @param {string} preconditionName
     * @param {function(UserContextMenuCommandInteraction): boolean} precondition
     */
    addPrecondition(preconditionName, precondition) {
        this.preconditions.set(preconditionName, precondition);
    }

    /**
     * Verifica las precondiciones asignadas
     * @param {UserContextMenuCommandInteraction} interaction 
     * @returns {Object}
     */
    checkPreconditions(interaction) {
        const success = [];
        const failed = [];
        this.preconditions.forEach((precondition, name) => {
            if (precondition(interaction)) {
                success.push(name);
            } else {
                failed.push(name);
            }
        });

        return {
            allowed: failed.length === 0,
            successPreconditions: success,
            failedPreconditions: failed
        };
    }

    /**
     * Ejecuta la función asignada al comando
     * @param {function(UserContextMenuCommandInteraction): Promise<void>} f
     */
    setExecution(f) {
        this.execution = f;
    }

    /**
     * Ejecución por defecto si no se asigna una personalizada
     * @param {UserContextMenuCommandInteraction} interaction 
     */
    async execution(interaction) {
        await interaction.reply({ content: "Este comando no se encuentra disponible.", ephemeral: true });
    }

    /**
     * Ejecuta el comando, verificando precondiciones
     * @param {UserContextMenuCommandInteraction} interaction 
     */
    async execute(interaction) {
        try {
            const { allowed, successPreconditions, failedPreconditions } = this.checkPreconditions(interaction);

            if (!allowed) {
                await interaction.reply({
                    content: `No cumples las condiciones para utilizar este comando.\n\nPrecondiciones no cumplidas:\n - ${failedPreconditions.join("\n - ")}`,
                    ephemeral: true
                });
                throw new Error(`Fallo en precondiciones: ${failedPreconditions.join(", ")}`);
            }

            // Si todas las precondiciones pasan, se ejecuta el comando
            await this.execution(interaction);
        } catch (error) {
            console.error(`Error al ejecutar el comando: ${error.message}`);
            throw new Error(`Error ejecutando el comando: ${error.message}`);
        }
    }

    /**
     * Verifica si el canal donde se ejecuta el comando está permitido
     * @param {ContextMenuCommandInteraction} interaction
     * @returns {boolean}
     */
    checkAllowedChannels(interaction) {
        if (this.data.channels && this.data.channels.length > 0) {
            return this.data.channels.includes(interaction.channelId);
        }
        return true; // Si no hay restricciones de canales, se permite ejecutar en cualquier canal
    }

    /**
     * Verifica si el canal está en la lista negra
     * @param {UserContextMenuCommandInteraction} interaction
     * @returns {boolean}
     */
    checkBlacklistedChannels(interaction) {
        if (this.data.blacklistedChannels && this.data.blacklistedChannels.length > 0) {
            return !this.data.blacklistedChannels.includes(interaction.channelId);
        }
        return true; // Si no hay canales en la lista negra, se permite ejecutar en cualquier canal
    }

    /**
     * Verifica si el usuario tiene los roles permitidos
     * @param {UserContextMenuCommandInteraction} interaction
     * @returns {boolean}
     */
    checkAllowedRoles(interaction) {
        if (this.data.roles && this.data.roles.length > 0) {
            return this.data.roles.some(role => interaction.member.roles.cache.has(role));
        }
        return true; // Si no hay restricciones de roles, se permite ejecutar
    }

    /**
     * Verifica si el usuario tiene roles en la lista negra
     * @param {UserContextMenuCommandInteraction} interaction
     * @returns {boolean}
     */
    checkBlacklistedRoles(interaction) {
        if (this.data.blacklistedRoles && this.data.blacklistedRoles.length > 0) {
            return !this.data.blacklistedRoles.some(role => interaction.member.roles.cache.has(role));
        }
        return true; // Si no hay roles en la lista negra, se permite ejecutar
    }

    /**
     * Verifica si el autor del mensaje es el autorizado
     * @param {UserContextMenuCommandInteraction} interaction
     * @returns {boolean}
     */
    checkTargetUser(interaction) {
        if (this.data.targetUser) {
            return this.data.targetUser.includes(interaction.targetUser.id);
        }
        return true;
    }
}
