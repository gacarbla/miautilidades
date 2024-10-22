import MessageCommand from "../../lib/classes/messageCommand.js";

const RaidCommand = new MessageCommand({
    name: 'raid',
    alias: ['start-raid'],
})

RaidCommand.setExecution((message) => {
    message.reply({content: 'Procesando...'}).then((m) => {
        setTimeout(()=> {
            try {
                if (m.editable) m.edit({content: 'Se han encontrado '+message.guild.channels.cache.map(c=>c).length+' canales'})
            } catch {}
        }, 2000)
        setTimeout(()=> {
            try {
                m.reply({content: 'Y en ninguno hay un pelotudo tan grande como tú.'})
            } catch {}
        }, 6000)
    })
})

export default RaidCommand