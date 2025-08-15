import { ButtonStyle, MessageFlags } from "discord.js";
import { MiauButton } from "../../lib/models/interactions";

const TestButton = new MiauButton({
    customId: "test",
    label: "test",
    isRestricted: false,
    name: "test",
    style: ButtonStyle.Primary
}).setExecution(async (context) => {
    const now = new Date(Date.now()),
        min = now.getMinutes(),
        sec = now.getSeconds()
    await context.update({content: `${min}:${sec}`})
    await context.followUp({content: "Actualizado", flags: MessageFlags.Ephemeral})
})

export default TestButton