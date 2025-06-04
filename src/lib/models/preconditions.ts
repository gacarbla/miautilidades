import { ComponentType, Interaction, InteractionType, Message, PermissionsBitField } from "discord.js";
import { MiauInteractionTypes } from "../types/interactions";
import { preconditionConstructorData, preconditionData } from "../interfaces/preconditions";

export default class Preconditions {
    private list: preconditionData[] = [];
    private data: preconditionConstructorData;

    /**
     * Precondiciones comunes predefinidas que se pueden cargar como plantillas.
     */
    static templates = {
        authorIsAdmin: {
            name: 'Author is admin',
            applyTo: ['slashCommand', 'message'] as MiauInteractionTypes[],
            function: async (context: Message<boolean> | Interaction) => {
                const member = context instanceof Message ? context.member : context.guild?.members.cache.get(context.user.id);
                return member ? member.permissions.has(PermissionsBitField.Flags.Administrator) : false;
            }
        },
        userHasManageMessagesPermission: {
            name: 'User has manage messages permission',
            applyTo: ['message'] as MiauInteractionTypes[],
            function: async (context: Message<boolean> | Interaction) => {
                const member = context instanceof Message ? context.member : context.guild?.members.cache.get(context.user.id);
                return member ? member.permissions.has(PermissionsBitField.Flags.ManageMessages) : false;
            }
        },
        isUsedInAGuild: {
            name: 'Command is used in a guild',
            applyTo: ['message', 'slashCommand', 'button', 'modal'] as MiauInteractionTypes[],
            function: async (context: Message<boolean> | Interaction) => {
                return Boolean(context.guild);
            }
        }
    };

    /**
     * Crea un grupo de precondiciones configurado con un nombre y método de evaluación.
     * @param data Datos de construcción
     */
    constructor(data: preconditionConstructorData) {
        this.data = data;
    }

    /**
     * Verifica que todas las precondiciones están correctamente definidas.
     * @returns Verdadero si son válidas, error si hay errores de definición.
     */
    test(): boolean {
        if (!Array.isArray(this.list)) {
            throw new Error("La lista de precondiciones no es un array válido.");
        }

        const validTypes: MiauInteractionTypes[] = [
            "message", "interaction", "slashCommand", "userContextMenu", "messageContextMenu", "contextMenu",
            "selectMenu", "roleSelectMenu", "userSelectMenu", "channelSelectMenu", "stringSelectMenu",
            "mentionableSelectMenu", "autocomplete", "button", "modal"
        ];

        const names = new Set<string>();

        for (const item of this.list) {
            if (typeof item.name !== 'string' || item.name.trim().length === 0) {
                throw new Error("Una precondición tiene un nombre inválido.");
            }

            if (names.has(item.name)) {
                throw new Error(`Nombre duplicado detectado en precondiciones: '${item.name}'`);
            }
            names.add(item.name);

            if (!Array.isArray(item.applyTo) || item.applyTo.length === 0) {
                throw new Error(`La precondición '${item.name}' tiene un campo 'applyTo' no válido.`);
            }

            const invalidTypes = item.applyTo.filter(t => !validTypes.includes(t));
            if (invalidTypes.length > 0) {
                throw new Error(`La precondición '${item.name}' contiene tipos inválidos en 'applyTo': ${invalidTypes.join(", ")}`);
            }

            if (typeof item.function !== 'function') {
                throw new Error(`La precondición '${item.name}' no tiene una función válida.`);
            }
        }

        return true;
    }



    /**
 * Añade una nueva precondición personalizada a la instancia.
 * Lanza un error si la definición es inválida o si rompe la consistencia de la instancia.
 * @param data Datos de la precondición a añadir
 */
    addPrecondition(data: preconditionData): this {
        if (
            typeof data.name !== 'string' ||
            !Array.isArray(data.applyTo) ||
            typeof data.function !== 'function'
        ) {
            throw new Error('Los datos proporcionados para la precondición no son válidos.');
        }

        this.list.push(data);

        // Validación estricta tras añadir
        this.test();

        return this
    }


    /**
     * Añade precondiciones desde las plantillas predefinidas.
     * @param names Lista de nombres válidos de plantillas a cargar
     */
    addFromTemplate(...names: (keyof typeof Preconditions.templates)[]): this {
        for (const name of names) {
            const template = Preconditions.templates[name];
            if (!template) {
                throw new Error(`La plantilla '${name}' no existe.`);
            }
            this.addPrecondition({ ...template });
        }

        return this
    }

    /**
     * Ejecuta las precondiciones según su método configurado.
     * @param context Objeto de interacción o mensaje actual
     * @returns Verdadero si se cumplen las condiciones requeridas
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
     * Devuelve todas las precondiciones registradas en esta instancia.
     * @returns Lista de precondiciones
     */
    getAll(): preconditionData[] {
        return this.list;
    }

    /**
     * Devuelve solo las precondiciones aplicables al tipo de interacción indicado.
     * @param type Tipo de interacción (ej: 'slashCommand')
     * @returns Lista filtrada de precondiciones
     */
    getForContext(type: MiauInteractionTypes): preconditionData[] {
        return this.list.filter(p => p.applyTo.includes(type));
    }

    /**
     * Fusiona las precondiciones de otra instancia con esta.
     * @param other Instancia de Preconditions a fusionar
     */
    merge(other: Preconditions): this {
        this.list.push(...other.getAll());
        return this
    }

    /**
     * Devuelve una representación legible de las precondiciones activas.
     * @returns Lista de descripciones formateadas
     */
    describe(): string[] {
        return this.list.map(p => `• ${p.name} (aplica a: ${p.applyTo.join(", ")})`);
    }

    /**
     * Determina el tipo de interacción actual.
     * @param context Objeto de interacción o mensaje
     * @returns Tipo identificado (usado para filtrar precondiciones)
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