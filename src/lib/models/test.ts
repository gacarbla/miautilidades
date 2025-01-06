import { MiauSlashCommand } from "./interactions";

export default new MiauSlashCommand({
    name: '',
    description: '',
    isRestricted: false
}).builder
    .addSubcommand(subcommand =>
        subcommand
            .setName("")
            .setDescription("")
            .setExecution(async (interaction)=>{
                await interaction.deferReply({ephemeral:true})
            })
    )
    .addSubcommandgroup(subcommandgroup=>
        subcommandgroup
            .setName("")
            .setDesription("")
            .addSubcommand(subcommand=>
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
                        await interaction.deferReply({ephemeral:true})
                        let letra = params.get('letra-param')
                    })
            )
    )