import Vue from 'vue'
import VueRouter from 'vue-router'
import {Cookies, Screen} from 'quasar'
import {sync} from "vuex-router-sync";

Vue.use(VueRouter)

export default function (ctx, routerInfo, app, hooks = {}) {


    const isClientProduction =
        !process.env.SERVER &&
        (process.env.NODE_ENV === 'production') &&
        (!process.env.APP_MODE || process.env.APP_MODE === 'prod');

    const store = ctx.store

    const router = new VueRouter({
        duplicateNavigationPolicy: 'reload',
        mode: process.env.VUE_ROUTER_MODE,
        base: process.env.VUE_ROUTER_BASE,
        ...routerInfo
    })

    const unsync = sync(store, router)

    let firstResolve = true

    router.beforeResolve(async (to, from, next) => {
        console.log('BEFORE RESOLVE')
        next()
    })

    router.beforeEach(async (to, from, next) => {

        const forceNative = store.getters['router/routeForceNative']

        if (hooks.beforeEach) {
            const res = await hooks.beforeEach(to, from, next, {
                router,
                firstResolve,
                forceNative
            })
            if (res === false) {
                store.commit('router/setRouteForceNative', false)
               return;
            }
        }

        store.commit('router/setRouteForceNative', false)

        const currentRouteName = store.state.route.name

        const cookies = process.env.SERVER ? Cookies.parseSSR(ctx.ssrContext) : Cookies

        const scopes = {
            app: true,
            user: true,
            sess: true
        }

        const guards = {}

        let vroute = null

        let pageView = {}

        const resolveCallbacks = (data, ctx, exclude) => {
            const cdata = {}

            for (const [key, value] of Object.entries(data)) {
                if (!exclude || exclude.indexOf(key) === -1) {
                    cdata[key] = typeof value === 'function' ? value(ctx) : value
                } else {
                    cdata[key] = value
                }
            }

            return cdata
        }

        to.matched.forEach((record) => {

            if (record.meta['vroute']) {

                if (!vroute) {
                    vroute = {
                        props: {}, name: to.name
                    }
                }

                const recVroute = record.meta['vroute']

                if (recVroute === true) {
                    vroute.enable = true
                } else if (typeof recVroute === 'object') {
                    vroute = {
                        ...vroute, ...resolveCallbacks(recVroute, {store}, ['is'])
                    }
                }
            }
            if (record.meta['scopes']) {
                record.meta['scopes'].forEach(scope => {
                    scopes[scope] = true
                })
            }
            if (record.meta['guards']) {

                for (let guardName in record.meta['guards']) {
                    let guardParams = record.meta['guards'][guardName]

                    if (!guardParams)
                        continue;

                    guards[guardName] = guardParams === true ? {} : guardParams
                }
            }

            if (record.meta['pageView']) {
                pageView = {
                    ...pageView, ...record.meta['pageView']
                }
            }
        })


        if (Object.keys(scopes).length) {
            console.log(scopes, 'scopesFetch')
            await store.dispatch('scopesFetch', Object.keys(scopes))
        }

        if (Object.keys(guards).length) {

            for (let guardName in guards) {

                let guardParams = guards[guardName]

                const guardResult = await store.dispatch('guardAccess', {
                    result: true,
                    guardName,
                    guardParams,
                    to: to
                })

                if (guardResult !== true) {

                    if (typeof guardParams === 'object') {

                        if (guardParams.message) {
                            store.$bus.emit('processMessage', guardParams.message);
                        }

                        if (guardResult.redirect) {

                            const redirect = guardResult.redirect

                            if (!redirect.query) redirect.query = {}

                            redirect.query.redirect = to.fullPath

                            next(redirect)
                        }
                    }

                    return
                }
            }
        }

        if (vroute) {

            let vrouteEnable = to.query.vroute || vroute.enable || (vroute.breakpoint && Screen.lt[vroute.breakpoint])

            if (vrouteEnable) {

                const toCurrent = to.matched[to.matched.length - 1]

                if (toCurrent.props && toCurrent.props.default) {
                    const toCurrentProps = toCurrent.props.default
                    if (typeof toCurrentProps === 'object') {
                        vroute.props = {
                            ...vroute.props, ...toCurrentProps
                        }
                    } else if (typeof toCurrentProps === 'function') {
                        vroute.props = {
                            ...vroute.props, ...toCurrentProps(to)
                        }
                    }
                }

                const query = store.$util.base.cloneDeep(to.query)

                if (typeof query.vroute === 'object') {
                    vroute = {
                        ...vroute, ...query.vroute,
                    }
                }

                delete query['vroute']

                vroute.props = {
                    ...vroute.props, ...to.params
                }

                Object.keys(query).forEach(param => {
                    if (param.startsWith('vroute_')) {
                        vroute[param.replace('vroute_', '')] = query[param]
                    } else {
                        vroute.props[param] = query[param]
                    }
                })

                if (!vroute.is) {
                    vroute.is = toCurrent.component || toCurrent.components.default
                }

                const vrouteUrl = to.path

                if (store.getters['router/vrouterHaveUrl'](vrouteUrl)) {
                    next(false)
                    return
                }

                vroute.url = to.path

                console.log(vroute)

                Vue.nextTick(function () {
                    if (firstResolve) {

                        let parentUrl = vroute.parentUrl

                        if (!parentUrl) {
                            const parentRoute = to.matched[to.matched.length-2]

                            if (parentRoute) {
                                parentUrl = parentRoute.path
                            }
                        }

                        next(parentUrl || '/')
                        setTimeout(() => {
                            store.dispatch('router/vrouterNav', vroute)
                        }, 300)
                    } else {
                        setTimeout(() => {
                            store.dispatch('router/vrouterNav', vroute)
                        }, 10)

                        next(false)
                    }
                })

                return

            } else {

                if (vroute.disabledRedirect) {
                    next(vroute.disabledRedirect)
                    return
                }
            }
        }

        let queryChanged = false

        const deleteParams = ['onResolve', 'onReject'], queryNew = {
            ...to.query
        }

        for (const p of deleteParams) {
            if (to.query[p]) {
                delete queryNew[p]
                queryChanged = true
            }
        }

        if (queryChanged) {
            next({path: to.path, query: queryNew})
            return;
        }

        if (firstResolve) {

            store.$bus.emit('route.first.resolved')

            firstResolve = false
        }

        store.commit('router/SET_PAGE_VIEW', pageView)

        next()

    })

    router.afterEach((to, from) => {
        app.runCallbacks('routerAfterEach', {
            Vue,
            router,
            to,
            from,
            isClientProduction
        })
    })

    app.runCallbacks('routerInit', {
        Vue,
        router,
        isClientProduction
    })

    return router
}
