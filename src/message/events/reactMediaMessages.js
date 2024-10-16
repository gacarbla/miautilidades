const imageFormat = ["png", "jpg", "webp", "gif"]
const videoFormat = ["mp4", "mov", "avi"]
const audioFormat = ["mp3", "wav"]
const channelsToCheck = [
    {
        id: "884002047656091648",
        contentAdmited: [...imageFormat]
    },
    {
        id: "853414489066831872",
        contentAdmited: [...imageFormat, ...videoFormat, ...audioFormat]
    },
    {
        id: "884035242384580669",
        contentAdmited: [...videoFormat]
    },
    {
        id: "1104556975360049152",
        contentAdmited: [...imageFormat]
    }
]

const reactMediaMessage = {
    data: {
        name: 'ReactMediaMessage'
    },
    precondition: (message) => channelsToCheck.map(m => m.id).includes(message.channelId),
    execute: (message) => {
        channelsToCheck.forEach(channel => {
            if ( channel.id == message.channelId && channel.contentAdmited.length > 0 ) {
                let coincidences = message.attachments.map(a => a.name).filter(a =>
                    channel.contentAdmited.includes(a.split(".")[a.split(".").length-1])
                )
                let coincidencelinks = message.content.split(" ").filter(w => 
                    w.split("://")[0] == ("https") && channel.contentAdmited.includes(w.split(".")[w.split(".").length-1].split("?")[0])
                )
                coincidences.push(...coincidencelinks)
                if (coincidences.length > 0) message.react("⭐")
            }
        })
    }
}

export default reactMediaMessage