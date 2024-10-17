import MessageCommand from "../../lib/classes/messageCommand.js"

const pingCommand = new MessageCommand({
    name: 'ping',
    alias: ['ping', 'pong', 'test', 'check'],
    channels: [],
    roles: []
})

pingCommand.setExecution((message) => {
    const date = Date.now()
    message.reply({content: "Ping!"}).then(m => {
        m.edit({content: `Pong! \`${Date.now()-date} ms\``})
    })
})

export default pingCommand