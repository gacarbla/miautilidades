import { SlashParamTypes } from "../../../lib/enum/interactions";
import { MiauSlashCommand } from "../../../lib/models/interactions";

const info = new MiauSlashCommand({
    name: 'info',
    description: 'Obtén información básica del bot',
    isRestricted: false
})

info.builder
    .addParam({
        customId: 'page',
        name: 'page',
        required: false,
        description: 'Página de información que quieres ver',
        type: SlashParamTypes.INTEGER
    })

info.setExecution(async (context)=>{
    context.reply({content: `Página seleccionada`})
})

export default info