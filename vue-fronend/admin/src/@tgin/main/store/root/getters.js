import app from '~src/boot/app'
import {Cookies} from 'quasar'
import randID from '@tgin/main/common/lib/util/base/randID'

export function scopeFetched(state, getters) {
    return (scope) => {
        const scopeInfo = app.getScopeInfo(scope)
        if (scopeInfo) {
            const module = scopeInfo.storeModule
            if (module && state[module] && state[module].scopes && state[module].scopes[scope]) {
                return state[module].scopes[scope].fetched
            }
        }
    }
}

export function moduleNames(state, getters) {
    return app.getStoreModuleNames()
}

export function httpClientContext(state, getters, rootState, rootGetters) {
    let context = {}

    if (typeof window !== 'undefined') {

        const t = rootState.route.fullPath

        if (!rootState.route.from) {
            context.route = {
                fullPath: window.location.href,
                name: '',
            }
        } else {
            context.route = {
                fullPath: window.location.href,
                name: rootState.route.name,
            }
        }

        const vroute = rootGetters['router/vrouterRoute']

        if (vroute) {
            context.vroute = {
                fullPath: vroute.url,
                name: vroute.name,
            }
        }

        context.clientUid = getters.clientUid
    }

    return context
}

export function clientUid(state, getters, rootState, rootGetters) {

    let clientId = Cookies.get('TG_CLIENT_ID')

    if (!clientId) {
        clientId = randID()
        Cookies.set('TG_CLIENT_ID', clientId, {expires: 1000, path: '/'})
    }

    return clientId
}

export function storeMap(state, getters, rootState, rootGetters) {
    return (hook, map, mapIndex) => {
        for (const moduleName of getters.moduleNames) {
            const moduleRes = rootGetters[moduleName + '/' + hook]
            if (moduleRes) {
                if (Array.isArray(map)) {
                    map = [...map, ...moduleRes]
                } else {
                    if (mapIndex) {
                        moduleRes.forEach(item => {
                            map[item[mapIndex]] = item
                        })
                    } else {
                        map = {
                            ...map,
                            ...moduleRes
                        }
                    }
                }
            }
        }
        return map
    }
}
