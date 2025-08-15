import {deepGet, deepSet} from './util/base'

export default class Config {

    constructor(data, emitter) {

        this.data = data || {}
        this.cache = {}
        this.cachedPaths = {}

        this.$emitter = emitter

        emitter.on('config.reload', this.reload.bind(this))
    }

    reload(data) {


       //this.merge(data)
    }

    updated() {
        this.cache = {}
        this.cachedPaths = {}
        this.$emitter.emit('config.updated')
    }

    on(name, cb) {
        this.$emitter.on('config.' + name, cb)
    }

    merge(data, path = null) {

        let sub

        if (!path) {
            sub = this.data
        } else {
            sub = deepGet(this.data, path)
            if (!sub) {
                sub = {}
                deepSet(this.data, path, sub)
            }
        }

        Object.assign(sub, data)

        this.updated()
    }

    get(path, def = null) {
        return deepGet(this.data, path, def)
    }

    set(path, val) {
         return deepSet(this.data, path, val)
    }

    getCached(path, def = null) {
        if (!this.cachedPaths[path]) {
            this.cache[path] = this.get(path, def)
            this.cachedPaths[path] = true;
        }
        return this.cache
    }
}
