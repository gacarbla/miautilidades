import MiauEvent from "../../lib/models/event";

const messageUpdate = new MiauEvent({
    customId: "messageUpdateTest"
})

messageUpdate.setExecution("messages.edited", async (o_message, n_message) => {
    console.log(`Old message: ${o_message.content}\nNew message: ${n_message.content}`)
})

export default messageUpdate