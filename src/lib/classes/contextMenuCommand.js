import { ContextMenuCommandInteraction, Collection, ContextMenuCommandBuilder } from "discord.js";

/**
 * @typedef {Object} Data
 * @property {string} name Nombre del comando
 * @property {string[]} channels Canales en los que está permitido utilizar el comando
 * @property {string[]} roles Roles con acceso al comando
 * @property {ContextMenuCommandBuilder} builder
 */

export default class ContextMenuCommand {
    /**
     * 
     * @param {Data} data 
     */
    constructor(data) {
        this.data = data
    }

    data = {}
    preconditions = new Collection()
    get builder() { return this.data.builder }

    /**
     * @param {string} preconditionName
     * @param {function(ContextMenuCommandInteraction): void} interaction
     */
    addPrecondition(preconditionName, precondition) {
        this.preconditions.set(preconditionName, precondition)
    }

    /**
     * 
     * @param {ContextMenuCommandInteraction} interaction 
     * @returns 
     */
    checkPreconditions(interaction) {
        var success = [], failed = []
        this.preconditions.map(p=>p.name).forEach(p=>{
            (this.preconditions.get(p)(interaction)?success:failed).push(p)
        })
        if (failed.map(p=>p).length > 0) return (false, success, failed)
        return (true, success, failed)
    }

    /**
     * 
     * @param {function(ContextMenuCommandInteraction): void} f
     */
    setExecution(f) {
        this.execution = f
    }

    /**
     * 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    execution(interaction) {
        interaction.reply({content: "Este comando no se encuentra disponible.", ephemeral: true})
    }

    /**
     * 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    execute(interaction) {
        let {permited, passedPreconditions, failedPreconditions} = this.checkPreconditions(message)
        if (permited) {
            console.log(`Precondiciones no cumplidas:\n - ${failedPreconditions.join("\n - ")}${'\n'*3}`)
        } else {
            this.execution(interaction)
        }
    }
}