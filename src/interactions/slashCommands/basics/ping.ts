import { MiauSlashCommand } from "../../../lib/models/interactions";

const ping = new MiauSlashCommand({
    name: 'ping',
    description: 'Responde pong',
    isRestricted: false
})

ping.setExecution(async (context)=>{
    context.reply({content: "¡Pong!"})
})

export default ping