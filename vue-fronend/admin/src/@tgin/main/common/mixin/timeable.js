
export default {
    data() {
        return {
            timeNow: 0,
            timeIntervalTimeout: 1000,
            timeInterval: false
        }
    },

    created() {

        this.timeNow = Date.now();

        if (!this.timeInterval)
            this.timeInterval = setInterval(() => this.timeNow = Date.now(), this.timeIntervalTimeout);
    },

    beforeDestroy() {
        clearInterval(this.timeInterval);
    },
}

