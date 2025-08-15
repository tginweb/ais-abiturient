export default class RequestError extends Error {
    constructor(message, data = {}, ctx = {}) {
        super(message)
        this.name = data.name
        this.category = data.category
        this.code = data.code
        this.data = data.data || {}
        this.context = ctx
    }
}
