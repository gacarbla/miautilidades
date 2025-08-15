import { SlashParamTypes } from "../../../lib/enum/interactions";
import { MiauSlashCommand } from "../../../lib/models/interactions";

const info = new MiauSlashCommand({
    name: 'info',
    description: 'Obtén información básica del bot',
    isRestricted: false
})

const builder = info.builder
    .addParam({
        customId: 'pages',
        name: 'page',
        required: false,
        description: 'Página de información que quieres ver',
        type: SlashParamTypes.INTEGER
    })

const p = builder.getParams()
p

export default info