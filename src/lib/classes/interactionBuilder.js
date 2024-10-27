/**
 *  @typedef  { "message" | "slashCommand" | "contextMenu" | "button" | "stringSelect" | "roleSelect" | "channelSelect" | "userSelect" | "modal" } InteractionType
 * 
 *  @typedef  { Object } Precondition
 *  @property { InteractionType[] } type
 *  @property { string[] } whitelistedServers
 *  @property { string[] } blacklistedServers
 *  @property { string[] } whitelistedChannels
 *  @property { string[] } blacklistedChannels
 *  @property { string[] } whitelistedRoles
 *  @property { string[] } blacklistedRoles
 * 
 *  @typedef  { Object } InteractionBuilderObject
 *  @property { InteractionType } type
 *  @property { Object   } builder
 * 
 *  @typedef  { Object   } InteractionData
 *  @property { InteractionBuilderObject[] } builders
 *  @property { Precondition[] } preconditions
 *  @property { string   } name
 *  @property { string[] } alias
 *  @property { InteractionType[] } type
 *  @property { string   } description
 *  @property { number   } cooldown
 */

class InteractionBuilder {

    builderVersion = 2

    /**
     * 
     * @param {InteractionData} data
     */
    constructor(data) {
        this.name = data.name;
        this.alias = data.alias || [];
        this.description = data.description;
        this.type = data.type;
        this.preconditions = data.preconditions || [];
        this.builders = data.builders || [];

        // Validar los builders según el tipo
        this.validateBuilders();
    }

    /**
     * Validates that the proper builder is provided for each interaction type.
     * Throws an error if the required builder is missing for the type.
     */
    validateBuilders() {
        const requiredBuilders = {
            "slashCommand": "SlashCommandBuilder",
            "message": null, // No specific builder needed for message commands
            "contextMenu": "ContextMenuCommandBuilder", // A hypothetical builder for context menus
            "button": "ButtonBuilder", // Button commands need a ButtonBuilder
            "stringSelect": "StringSelectMenuBuilder",
            "roleSelect": "RoleSelectMenuBuilder",
            "userSelect": "UserSelectMenuBuilder",
            "channelSelect": "ChannelSelectMenuBuilder",
            "modal": "ModalBuilder" // Hypothetical builder for modals
        };
        this.builders.forEach(builderData => {
            const { type, builder } = builderData;
            if (requiredBuilders[type] && !(builder instanceof global[requiredBuilders[type]])) {
                throw new Error(`El tipo de interacción "${type}" requiere un constructor de tipo "${requiredBuilders[type]}".`);
            }
        });
    }

    /**
     * 
     * @param {InteractionType} type 
     * @param {*} builder 
     */
    addBuilder(type, builder) {
        if (type == "slashCommand")
            builder
                .setName(this.name)
                .setDescription(this.description)
        this.builders.push({type, builder})
    }

    /**
     * Assigns a custom execution function to a specific interaction type.
     * @param {InteractionType} type The interaction type (e.g., "message", "slashCommand").
     * @param {function(Object): Promise<void>} f The execution function.
     */
    setExecution(type, f) {
        this.execution[type] = f;
    }

    /**
     * Executes the interaction, checking preconditions before running.
     * Calls the appropriate execution function based on the interaction type.
     * @param {Object} context - The interaction object, which can be a Message or Interaction.
     */
    async execute(context) {
        const interactionType = this.getInteractionType(context);
        const allowed = this.checkPreconditions(interactionType, context);
        if (!allowed) {
            context.reply({
                content: "Careces de permiso para utilizar este comando",
                ephemeral: true
            });
        } else {
            try {
                if (this.execution[interactionType]) {
                    await this.execution[interactionType](context); // Ejecutar la función asignada
                } else {
                    await this.defaultExecution(context); // Ejecutar la función predeterminada si no hay una personalizada
                }
            } catch (error) {
                console.error(`Error durante la ejecución del comando "${this.name}":`, error);
                const embed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setDescription(error.message)
                    .setColor(0xed4245);
                try {
                    await context.reply({
                        ephemeral: true,
                        embeds: [embed]
                    });
                } catch {
                    await context.editReply({
                        content: "",
                        ephemeral: true,
                        embeds: [embed]
                    });
                }
            }
        }
    }

    /**
     * Determines the interaction type based on the context (Message or Interaction).
     * @param {Object} context The context object, either a Message or Interaction.
     * @returns {string} The interaction type, such as "message", "slashCommand", "button", etc.
     */
    getInteractionType(context) {
        if (context.isCommand && context.isCommand()) {
            return "slashCommand";
        } else if (context.isMessageComponent && context.isButton()) {
            return "button";
        } else if (context.isMessageComponent && context.isSelectMenu()) {
            // For select menus, infer the type
            if (context.customId.startsWith("stringSelect")) return "stringSelect";
            if (context.customId.startsWith("roleSelect")) return "roleSelect";
            if (context.customId.startsWith("userSelect")) return "userSelect";
            if (context.customId.startsWith("channelSelect")) return "channelSelect";
        } else if (context instanceof Message) {
            return "message";
        } else if (context.isContextMenuCommand && context.isContextMenuCommand()) {
            return "contextMenu";
        }
        return "unknown";
    }

    /**
     * Default execution function, replies that the command is unavailable.
     * @param {Object} context The interaction or message context object.
     */
    async defaultExecution(context) {
        context.reply({ content: "Este comando no se encuentra disponible.", ephemeral: true });
    }

    /**
     * Validates if any precondition block is fully satisfied.
     *
     * @param {InteractionType} interactionType The type of interaction being checked, e.g., "message" or "slashCommand".
     * @param {Object} interaction The interaction object (e.g., Discord interaction).
     * @returns {Object} An object indicating if allowed, and arrays of successful and failed preconditions.
     */
    checkPreconditions(interactionType, interaction) {
        let success = [], failed = [];
        const isValidBlock = this.preconditions.some(block => {
            const typeMatches = block.type === interactionType;
            const channelMatches = !block.channel || block.channel.includes(interaction.channelId);
            const roleMatches = !block.role || block.role.some(roleId => interaction.member.roles.cache.has(roleId));
            if (typeMatches && channelMatches && roleMatches) {
                success.push(block);
                return true;
            } else {
                failed.push(block);
                return false;
            }
        });
        return isValidBlock
    }
}

export default InteractionBuilder