import { MiauSlashCommand } from "../lib/models/interactions";
import Preconditions from "../lib/models/preconditions";

const command = new MiauSlashCommand({
    name: 'test',
    description: 'Comando de ejemplo',
    isRestricted: false
})

const preconditions = new Preconditions({method: "one", name: "testprecondition"})
preconditions
    .addFromTemplate("authorIsAdmin")
    .addFromTemplate("userHasManageMessagesPermission")
command
    .addPreconditions(preconditions)
    .setExecution(async (context)=>{
        context.reply({content: "Funciona"})
    })
    .builder
        .addParam({
            customId: "",
            description: "",
            name: "",
            required: false,
            type: "text",
        })