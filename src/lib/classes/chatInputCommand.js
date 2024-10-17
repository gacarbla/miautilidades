import { ChatInputCommandInteraction, Collection, SlashCommandBuilder } from "discord.js";

/**
 * @typedef {Object} Data
 * @property {string} name Nombre del comando
 * @property {string[]} channels Canales en los que está permitido utilizar el comando
 * @property {string[]} roles Roles con acceso al comando
 * @property {SlashCommandBuilder} builder
 */

export default class ChatInputCommand {
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
     * @param {function(ChatInputCommandInteraction): void} interaction
     */
    addPrecondition(preconditionName, precondition) {
        this.preconditions.set(preconditionName, precondition)
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
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
     * @param {function(ChatInputCommandInteraction): void} f
     */
    setExecution(f) {
        this.execution = f
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execution(interaction) {
        interaction.reply({content: "Este comando no se encuentra disponible.", ephemeral: true})
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction) {
        let {permited, passedPreconditions, failedPreconditions} = this.checkPreconditions(interaction)
        if (permited) {
            console.log(`Precondiciones no cumplidas:\n - ${failedPreconditions.join("\n - ")}${'\n'*3}`)
        } else {
            this.execution(interaction)
        }
    }
}