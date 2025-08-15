import {deepGet, deepSet} from './util/base'

export default class Registry {

    constructor(data = {}) {
        this.data = data
        this.hooks = {}
    }

    addHook(name, cb) {

        if (!this.hooks[name])
            this.hooks[name] = {
                done: false,
                callbacks: []
            }

        this.hooks[name].callbacks.push({
            done: false,
            cb
        })

        this.hooks[name].done = false
    }

    applyHooks(name, reload = false, value = {}) {

        value = this.data[name] || value

        if (this.hooks[name]) {

            if (!this.hooks[name].done || reload) {

                this.hooks[name].callbacks.forEach((item) => {

                    if (!item.done || reload) {
                        item.cb.apply(this, [value])
                        item.done = true
                    }

                })

                this.hooks[name].done = true
            }

            this.data[name] = value
        }

        return value
    }

    getHook(name, path, value = {}) {
        value = this.applyHooks(name, false, value)
        return path ? deepGet(value, path) : value
    }
}
