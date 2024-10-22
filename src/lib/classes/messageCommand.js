/**
 * @typedef {Object} Data
 * @property {string} name Nombre del comando
 * @property {string[]} alias Array de alias del comando
 * @property {string[]} channels Canales en los que está permitido utilizar el comando
 * @property {string[]} roles Roles con acceso al comando
 */

import { Collection, Message } from "discord.js"

export default class MessageCommand {
    /**
     * @param {Data} data 
     */
    constructor(data) {
        this.data = data
    }

    data = {}
    preconditions = new Collection()

    /**
     * 
     * @param {function(Message): void} f
     */
    setExecution(f) {
        this.execution = f
    }

    /**
     * @param {string} preconditionName
     * @param {function(Message): void} precondition
     */
    addPrecondition(preconditionName, precondition) {
        this.preconditions.push({ name: preconditionName, run: precondition });
    }

    /**
     * 
     * @param {Message} message 
     * @returns 
     */
    checkPreconditions = (message) => {
        var success = [], failed = []
        this.preconditions.forEach(p => {
            let passed = p.run(interaction);
            passed ? success.push(p.name) : failed.push(p.name);
        });
        if (failed.length > 0) return { allowed: false, success, failed }
        return { allowed: true, success, failed };
    }

    /**
     * 
     * @param {Message} message 
     */
    execution(message) {
        message.reply({ content: "Este comando no se encuentra disponible." })
    }

    /**
     * 
     * @param {Message} message 
     */
    execute(message) {
        const result = this.checkPreconditions(message)
        if (!result.allowed) {
            message.reply({
                content: "No cumples las condiciones para utilizar este comando.\n```\nCondiciones no cumplidas:\n - " + result.failed.join("\n - ") + "\n```",
            }).then((m) => {
                setTimeout(() => {
                    try {
                        if (m.deletable) {
                            m.delete()
                        }
                        if (message.deletable) {
                            message.delete()
                        }
                    } catch { }
                }, 3000)
            });
        } else {
            this.execution(message)
        }
    }
}