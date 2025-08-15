var ls = require('local-storage');

class lsEventsClass {

    static get instance() {
        if (!this['singleton']) this['singleton'] = new lsEventsClass();
        return this['singleton'];
    }

    static set instance(v) { throw "Can't change constant property!" }

    constructor() {

        this.listeners = {};

    }

    on(eventName, cb) {

        ls.on(eventName, (packet) => {

            let data = JSON.parse(packet)

            cb(data.data)
        });
    }

    emit(eventName, data) {

        let packet = {
            ts : Date.now(),
            data : data,
        }

        ls.set(eventName, JSON.stringify(packet));
    }
}

let lsEvents = lsEventsClass.instance

export {
    lsEventsClass,
    lsEvents
}
