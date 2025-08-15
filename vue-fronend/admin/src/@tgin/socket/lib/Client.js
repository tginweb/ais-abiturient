export default class {

    constructor(ctx) {
        this.ctx = ctx
        this.socket = null
    }

    connect() {

        let ws = new WebSocket(`ws://dev.garden.prod.loc/ws`);

        this.socket = ws

        ws.onerror = () => {
            console.log('WebSocket error');
        }

        ws.onopen = () => {
            console.log('WebSocket connection established');
        }

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            ws = null;
        }

        ws.onmessage = this.onMessage.bind(this)
    }

    onMessage(event) {
        const data = JSON.parse(event.data);
        this.ctx.$bus.emit('socket:' + data.eventName, data.eventData)
    }

    disconect() {
        if (this.socket) {
            this.socket.close()
        }
    }

    send(msg) {
        console.log(this)

        this.socket.send(msg)
    }
}

