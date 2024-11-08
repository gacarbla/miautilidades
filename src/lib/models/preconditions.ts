import { ComponentType, Interaction, InteractionType, Message, PermissionsBitField } from "discord.js";

type MiauInteractionTypes =
    "message" |
    "interaction" |
    "slashCommand" |
    "userContextMenu" |
    "messageContextMenu" |
    "contextMenu" |
    "selectMenu" |
    "roleSelectMenu" |
    "userSelectMenu" |
    "channelSelectMenu" |
    "stringSelectMenu" |
    "mentionableSelectMenu" |
    "autocomplete" |
    "button" |
    "modal";

type PreconditionMethod = "all" | "one" | "none";

interface preconditionConstructorData {
    name: string;
    method: PreconditionMethod;
}

interface preconditionData {
    name: string;
    applyTo: MiauInteractionTypes[];
    function: (context: Message | Interaction) => Promise<boolean>;
}

interface PreconditionMap {
    [key: string]: preconditionData;
}


export default class Preconditions {
    private list: preconditionData[] = [];
    private data: preconditionConstructorData;
    
    // Precondiciones disponibles como plantillas para añadir
    static templates:PreconditionMap = {
        authorIsAdmin: {
            name: 'Author is admin',
            applyTo: ['slashCommand', 'message'],
            function: async (context) => {
                const member = context instanceof Message ? context.member : context.guild?.members.cache.get(context.user.id);
                return member ? member.permissions.has(PermissionsBitField.Flags.Administrator) : false;
            }
        },
        userHasManageMessagesPermission: {
            name: 'User has manage messages permission',
            applyTo: ['message'],
            function: async (context) => {
                const member = context instanceof Message ? context.member : context.guild?.members.cache.get(context.user.id);
                return member ? member.permissions.has(PermissionsBitField.Flags.ManageMessages) : false;
            }
        },
        isUsedInAGuild: {
            name: 'Command is used in a guild',
            applyTo: ['message', 'slashCommand', 'button', 'modal'],
            function: async (context) => {
                return Boolean(context.guild);
            }
        }
    };

    constructor(data: preconditionConstructorData) {
        this.data = data;
    }

    /**
     * Comprueba que todo está en orden. Hace todas las verificaciones oportunas para minimizar el riesgo de errores o malos funcionamientos.
     * @returns Devuelve verdadero si todo parece estar en orden, falso de lo contrario
     */
    test(): boolean {
        return Array.isArray(this.list) &&
            this.list.every(item => typeof item.name === 'string' &&
                Array.isArray(item.applyTo) &&
                typeof item.function === 'function');
    }

    /**
     * Añade una precondición a la lista de precondiciones.
     * @param data Información de la precondición que se va a añadir
     */
    addPrecondition(data: preconditionData): void {
        if (data && typeof data.name === 'string' && Array.isArray(data.applyTo) && typeof data.function === 'function') {
            this.list.push(data);
        } else {
            throw new Error('Invalid precondition data');
        }
    }

    /**
     * Dados los parámetros, comprueba si se cumplen las precondiciones conforme a la configuración indicada.
     * @param context Parámetros
     * @returns Devuelve verdadero si se cumplen las precondiciones, falso de lo contrario
     */
    async check(context: Message | Interaction): Promise<boolean> {
        const relevantPreconditions = this.list.filter(precondition =>
            precondition.applyTo.includes(this.getContextType(context))
        );

        if (relevantPreconditions.length === 0) return true;

        const results = await Promise.all(relevantPreconditions.map(precondition => precondition.function(context)));

        switch (this.data.method) {
            case 'all':
                return results.every(result => result);
            case 'one':
                return results.some(result => result);
            case 'none':
                return results.every(result => !result);
            default:
                throw new Error(`Unknown precondition method: ${this.data.method}`);
        }
    }

    /**
     * Determina el tipo de contexto en base al objeto de interacción o mensaje.
     * @param context Contexto del mensaje o interacción.
     * @returns El tipo correspondiente de MiauInteractionTypes.
     */
    private getContextType(context: Message | Interaction): MiauInteractionTypes {
        if (context instanceof Message) return 'message';
        switch (context.type) {
            case InteractionType.ApplicationCommand: return 'slashCommand';
            case InteractionType.MessageComponent:
                switch (context.componentType) {
                    case ComponentType.Button: return 'button';
                    case ComponentType.RoleSelect: return 'roleSelectMenu';
                    case ComponentType.UserSelect: return 'userSelectMenu';
                    case ComponentType.ChannelSelect: return 'channelSelectMenu';
                    case ComponentType.StringSelect: return 'stringSelectMenu';
                    case ComponentType.MentionableSelect: return 'mentionableSelectMenu';
                    default: return 'contextMenu';
                }
            case InteractionType.ModalSubmit: return 'modal';
            case InteractionType.ApplicationCommandAutocomplete: return 'autocomplete';
            default: return 'interaction';
        }
    }
}
