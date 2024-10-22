import { Message } from "discord.js"

const ghostAppears = {
    data: {
        name: 'GhostAppears'
    },
    /**
     * 
     * @param {Message} message 
     * @returns 
     */
    precondition: (message) => {
        const enabled = false
        let isBot = message.author.bot,
            rand = Math.floor(Math.random() * 50);
        return !isBot && (rand == 5) && enabled
    },
    
    /**
     * 
     * @param {Message} message 
     */
    execute: (message) => {
        message.reply({content: '## Fantaaasmaaa <:cat_ghost:1298027555357593672>\nTu mensaje ha invocado un fantasma.\nCualquier usuario puede capturarlo con su licencia de cazafantasmas.'})
    }
}

export default ghostAppears