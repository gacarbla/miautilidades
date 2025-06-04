import { MiauSlashCommand } from "../lib/models/interactions";
import Preconditions from "../lib/models/preconditions";

const ping = new MiauSlashCommand({
    name: 'ping',
    description: 'Responde pong',
    isRestricted: false
})

ping.builder
    .addParam({
        customId: "test",
        name: "test",
        description: "Prueba de parámetro",
        required: false,
        type: "text"
    })

const precondition = new Preconditions({method: "one", name:"testPrecondition"})
precondition.addFromTemplate("authorIsAdmin")
precondition.addFromTemplate("userHasManageMessagesPermission")

ping.addPreconditions(
    precondition
).setExecution(async (context)=>{
    context.reply({content: "¡Pong!"})
})

export default ping