import { SlashParamTypes } from "../../../lib/enum/interactions";
import { MiauSlashCommand } from "../../../lib/models/interactions";

const info = new MiauSlashCommand({
    name: 'info',
    description: 'Obtén información básica del bot',
    isRestricted: false
})

export const info_builder = info.setBuilder(
    info.builder
        .addParam({
            customId: "mention",
            description: "Usuario a mencionar",
            name: "mencionar",
            required: true,
            type: SlashParamTypes.USER
        })
        .setExecution(async (i, p) => {
            i.reply({ content: `${i.member} menciona a ${p.mention}` })
        })
)

export default info