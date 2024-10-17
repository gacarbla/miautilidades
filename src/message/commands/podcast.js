import MessageCommand from "../../lib/classes/messageCommand.js"

const podcastCommand = new MessageCommand({
    name: 'podcast',
    alias: ['podcast', 'pc', 'radio'],
    channels: [],
    roles: []
})

export default podcastCommand