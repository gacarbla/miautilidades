const reactBoostMessage = {
    data: {
        name: 'ReactBoostMessage'
    },
    precondition: (message) => message.channelId == "1252487402438660147",
    execute: (message) => {
        message.react("1282916148421201971")
    }
}

export default reactBoostMessage