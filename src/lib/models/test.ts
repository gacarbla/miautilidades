import { EmbedBuilder } from "discord.js";
import { MiauMessageCommand, MiauSlashCommand } from "./interactions";

let b = new MiauSlashCommand({
    name: '',
    description: '',
    isRestricted: false
}).builder
    .addSubcommand(subcommand =>
        subcommand
            .setName("")
            .setDescription("")
            .setExecution(async (interaction) => {
                await interaction.deferReply({ ephemeral: true })
            })
    )
    .addSubcommandgroup(subcommandgroup =>
        subcommandgroup
            .setName("")
            .setDescription("")
            .addSubcommand(subcommand =>
                subcommand
                    .setName("")
                    .setDescription("")
                    .addParam({
                        customId: 'letra-param',
                        description: '',
                        name: '',
                        required: true,
                        type: 'letter',
                    })
                    .setExecution(async (interaction, params) => {
                        await interaction.deferReply({ ephemeral: true })
                        let letra = params.get('letra-param')
                    })
            )
    )

export default new MiauMessageCommand({
    name: 'ping',
    alias: ['pong'],
    description: 'Comprueba la latencia del bot',
    isRestricted: false
}).build.setExecution((message, params) => {
    const sendtime = message.createdTimestamp,
        readtime = Date.now() - sendtime
    let description = `Lectura: \`${readtime} ms\``
    const embed = new EmbedBuilder()
        .setTitle('¡Pong!').setDescription(description)
    message.reply({ embeds: [embed] }).then((m) => {
        const replytime = m.createdTimestamp
        embed.setDescription(description + `\nRespuesta: \`${replytime} ms\``)
    })
})