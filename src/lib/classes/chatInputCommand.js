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
        this.addPrecondition("Roles", (interaction)=>{
            var permitted = false
            this.data.roles.forEach(r => {
                if (interaction.member.roles.cache.has(r)) permitted = true
            })
            return permitted
        })
    }

    preconditions = []
    get builder() { return this.data.builder }

    /**
     * @param {string} preconditionName
     * @param {function(ChatInputCommandInteraction): void} precondition
     */
    addPrecondition(preconditionName, precondition) {
        this.preconditions.push({name: preconditionName, run: precondition})
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns 
     */
    checkPreconditions(interaction) {
        var success = [], failed = []
        this.preconditions.forEach(p=>{
            let passed = p.run(interaction);
            passed?success.push(p.name):failed.push(p.name)
        })
        if (failed.map(p=>p).length > 0) return {allowed: false, success, failed}
        return {allowed: true, success, failed}
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
        let result = this.checkPreconditions(interaction)
        if (!result.allowed) {
            interaction.reply({content: "No cumples las condiciones para utilizar este comando.\n```\nCondiciones no cumplidas:\n - "+result.failed.join("\n - ")+"\n```", ephemeral: true})
        } else {
            this.execution(interaction)
        }
    }
}