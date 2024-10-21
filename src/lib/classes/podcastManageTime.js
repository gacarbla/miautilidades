export default class PodcastManageTime {
    /**
     * 
     * @param {string} guildId 
     */
    constructor(guildId) {
        this.guildId = guildId
        this.listen()
    }

    listenerTimes = [1, 45, 110, 120, 130]

    listen() {
        setInterval(() => {
            this.listenerTimes.forEach(t => {
                if ( Math.floor(this.actualtime.ms/(1000*60)) > t && Math.floor(this.lastlog/(1000*60)) < t ) {
                    this.lastlog = Date.now()
                    this.listener(this.actualtime.ms)
                }
            })
        }, 10000)
    }

    /**
     * @param {...number} times 
     */
    setListenerTimes(...times) {
        this.listenerTimes = times
    }

    addListenerTimes(...times) {
        this.listenerTimes.push(...times)
    }

    /**
     * 
     * @param {number} t 
     */
    listener(t) {
        console.log(`Han pasado ${Math.floor(t/(1000*60))} minutos`)
    }

    /**
     * @param {function(number): void} f 
     */
    setListener(f) {
        this.listener = f
    }

    guildId = ""
    status = "INACTIVE"
    firstStart = undefined
    lastStart = undefined
    time = undefined
    pausedTimes = 0
    lastlog = 0

    get pausedTimes() {
        return this.pausedTimes
    }

    /**
     * @returns {boolean}
     */
    get active() {
        return this.status == "ACTIVE"
    }

    /**
     * @returns {boolean}
     */
    get paused() {
        return this.status == "PAUSED"
    }

    /**
     * @returns {boolean}
     */
    get inactive() {
        return this.status == "INACTIVE"
    }

    /**
     * @returns {{ms: number, formatted: string}}
     */
    get actualtime() {
        let time = this.time
        if (this.status == "ACTIVE") time += Date.now() - this.lastStart
        return {
            ms: time,
            formatted: formatTime(time)
        }
    }

    actions = {
        start: () => {
            if (this.inactive) {
                this.status = "ACTIVE"
                this.firstStart = Date.now()
                this.lastStart = this.firstStart
                this.time = 0
                this.pausedTimes = 0
            }
        },
        end: () => {
            if (this.active) {
                this.status = "INACTIVE"
                this.time += Date.now() - this.lastStart
                this.lastStart = undefined
            } else if (this.paused) {
                this.status == "INACTIVE"
            }
        },
        pause: () => {
            if (this.active) {
                this.status = "PAUSED"
                this.time += Date.now() - this.lastStart
                this.lastStart = undefined
                this.pausedTimes += 1
            }
        },
        resume: () => {
            if (this.paused) {
                this.status = "ACTIVE"
                this.lastStart = Date.now()
            }
        }
    }
}

function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
}