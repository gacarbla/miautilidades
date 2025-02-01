import { MiauSlashCommandParam } from "../interfaces/interaction"
import { MiauMessageCommandParam } from "../interfaces/messageCommand";

export default class InteractionUtils {
    static verify = {
        param: {
            slash: (param: MiauSlashCommandParam): boolean => {
                const stringTypes = ['word', 'text', 'letter'];

                if (
                    typeof param.customId !== 'string' ||
                    typeof param.name !== 'string' ||
                    typeof param.description !== 'string' ||
                    typeof param.required !== 'boolean' ||
                    !['word', 'membermention', 'attachment', 'text', 'number', 'int', 'mention', 'channel', 'usermention', 'rolemention', 'letter', 'boolean'].includes(param.type)
                ) {
                    return false;
                }

                if (stringTypes.includes(param.type)) {
                    if (param.choices) {
                        if (!Array.isArray(param.choices) || param.choices.some(choice => typeof choice !== 'string')) {
                            return false;
                        }
                        if (param.min_len !== undefined || param.max_len !== undefined) {
                            return false;
                        }
                    } else {
                        if (param.min_len !== undefined && (typeof param.min_len !== 'number' || param.min_len < 0)) {
                            return false;
                        }
                        if (param.max_len !== undefined && (typeof param.max_len !== 'number' || param.max_len < 0)) {
                            return false;
                        }
                        if (param.min_len !== undefined && param.max_len !== undefined && param.min_len > param.max_len) {
                            return false;
                        }
                    }
                }

                if (param.type === 'number') {
                    if (param.max_floating !== undefined && (typeof param.max_floating !== 'number' || param.max_floating < 0)) {
                        return false;
                    }
                    if (param.min !== undefined && typeof param.min !== 'number') {
                        return false;
                    }
                    if (param.max !== undefined && typeof param.max !== 'number') {
                        return false;
                    }
                    if (param.min !== undefined && param.max !== undefined && param.min > param.max) {
                        return false;
                    }
                }

                if (param.type === 'int') {
                    if (param.min !== undefined && !Number.isInteger(param.min)) {
                        return false;
                    }
                    if (param.max !== undefined && !Number.isInteger(param.max)) {
                        return false;
                    }
                    if (param.min !== undefined && param.max !== undefined && param.min > param.max) {
                        return false;
                    }
                }

                return true;
            }
        },

        // TODO: Terminar verificador de parámetro correcto.
        message: (param: MiauMessageCommandParam):boolean => {
            if (param) return true
            return false
        }
    }
}