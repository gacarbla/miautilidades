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
        this.preconditions.set(preconditionName, precondition)
    }

    /**
     * 
     * @param {Message} message 
     * @returns 
     */
    checkPreconditions(message) {
        var success = [], failed = []
        this.preconditions.map(p=>p.name).forEach(p=>{
            (this.preconditions.get(p)(message)?success:failed).push(p)
        })
        if (failed.map(p=>p).length > 0) return (false, success, failed)
        return (true, success, failed)
    }

    /**
     * 
     * @param {Message} message 
     */
    execution(message) {
        message.reply({content: "Este comando no se encuentra disponible."})
    }

    execute(message) {
        let {permited, passedPreconditions, failedPreconditions} = this.checkPreconditions(message)
        if (permited) {
            console.log(`Precondiciones no cumplidas:\n - ${failedPreconditions.join("\n - ")}${'\n'*3}`)
        } else {
            this.execution(message)
        }
    }
}