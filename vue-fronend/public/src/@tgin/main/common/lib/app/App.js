import {deepGet, deepSet} from '@tgin/main/common/lib/util/base'

export default class App {

    constructor(data = {}) {
        this.data = data
        this.modules = []
        this.modulesCallbacks = {
            boot: [],
            request: [],
            store: [],
            scopeQuery: [],
            guardAccess: [],
            routes: [],
            routesPrebuild: [],
            scopes: [],
            widgets: [],
            routerInit: [],
            routerAfterEach: [],
        }
        this.scaned = false
        this.scopes = null

        this.routes = []
        this.routesBuilded = []
        this.routesBuildedMap = {}

        this.widgets = null

        this.storeModulesNames = []

        this.hooks = {}

        this.appScope = null

        this.context = null

        this.httpRequestHeader = {}
        this.components = {}
    }

    setAppScope(scope) {
        this.appScope = scope
    }

    inAppScope(scope) {
        return this.appScope === scope
    }

    registerModules(items) {
        for (const item of items) {
            this.modules.push(item)
        }
    }

    scanModules() {

        const scan = (tree, contextOptions) => {

            tree.forEach((mod) => {

                let module, options

                if (Array.isArray(mod)) {

                    module = mod[0]

                    if (!module) return;

                    let appScope
                    let localOptions

                    if (mod[1] && (typeof mod[1] === 'string')) {
                        appScope = mod[1]
                        localOptions = mod[2] || {}
                    } else {
                        localOptions = mod[1] || {}
                    }

                    if (appScope && !this.inAppScope(appScope))
                        return;

                    delete localOptions.appScope

                    options = {
                        ...contextOptions,
                        ...localOptions
                    }

                    if (module.register) {
                        options = module.register(options)
                    }

                } else {
                    module = mod

                    if (!module) return;

                    if (module.register) {
                        options = {
                            ...contextOptions,
                        }
                        options = module.register(options)
                    } else {
                        options = contextOptions
                    }
                }

                const moduleKeys = Object.keys(module)

                for (let key of moduleKeys) {
                    if (this.modulesCallbacks[key]) {
                        this.modulesCallbacks[key].push([module[key], options])
                    }
                }

                if (module.children) {
                    const children = module.children(options, this)
                    scan(children, options)
                }
            })
        }

        scan(this.modules, {})

        this.scaned = true
    }

    getCallbacks(name) {

        if (!this.scaned)
            this.scanModules()

        return this.modulesCallbacks[name]
    }

    applyFilters(name, val, ...args) {

        const callbacks = this.getCallbacks(name)

        if (callbacks) {
            for (const cb of callbacks) {
                const self = {
                    $app: this,
                    options: cb[1],
                }
                val = cb[0].apply(self, [...[val], ...args])
            }
        }

        if (this.hooks[name]) {
            for (const cb of this.hooks[name]) {
                const self = {
                    $app: this,
                    options: cb[1],
                }
                val = cb.apply(self, [...[val], ...args])
            }
        }

        return val
    }

    async applyFiltersAsync(name, val, ...args) {

        const callbacks = this.getCallbacks(name)

        if (callbacks) {
            for (const cb of callbacks) {
                const self = {
                    $app: this,
                    options: cb[1],
                }
                val = await cb[0].apply(self, [val, ...args])
            }
        }

        if (this.hooks[name]) {
            for (const cb of this.hooks[name]) {
                const self = {
                    $app: this,
                    options: cb[1],
                }
                val = await cb.apply(self, [val, ...args])
            }
        }

        return val
    }

    runCallbacks(name, ...args) {

        const callbacks = this.getCallbacks(name)

        for (const cb of callbacks) {
            const self = {
                $app: this,
                options: cb[1]
            }
            cb[0].apply(self, args)
        }

        return args[0]
    }

    async runCallbacksAsync(name, ...args) {
        const callbacks = this.getCallbacks(name)
        for (const cb of callbacks) {
            const self = {
                $app: this,
                options: cb[1],
            }
            await cb[0].apply(self, args)
        }
        return args[0]
    }

    onBoot(ctx) {
        this.runCallbacks('boot', ctx)
    }

    async onRequest(ctx) {
        await this.runCallbacksAsync('request', ctx)
    }

    getStoreModules() {
        const ctx = {}
        this.runCallbacks('store', ctx)
        this.storeModulesNames = Object.keys(ctx)
        return ctx
    }

    getStoreModuleNames() {
        return this.storeModulesNames
    }

    getScopes() {
        if (this.scopes === null) {
            this.scopes = this.runCallbacks('scopes', {})
        }
        return this.scopes
    }

    getScopeInfo(name) {
        const scopes = this.getScopes()
        return scopes[name]
    }

    async guardAccess(result, data) {
        return await this.applyFiltersAsync('guardAccess', result, data)
    }

    scopeQuery(query, scope) {
        return this.applyFilters('scopeQuery', query, scope)
    }

    addRoutes(routes) {
        Array.prototype.push.apply(this.routes, routes)
    }

    buildRoutes() {

        this.runCallbacks('routes', this.routes)

        let mapByName = {}

        for (let route of this.routes) {
            if (route.name) {
                mapByName[route.name] = route
            }
        }

        this.runCallbacks('routesPrebuild', this.routes, mapByName)

        for (let route of this.routes) {
            if (route.name && !mapByName[route.name]) {
                mapByName[route.name] = route
            }
        }

        const res = []
        const ctx = {}

        for (let route of this.routes) {

            if (route.disable) {
                continue;
            }

            if (route.parent) {
                const parentName = route.parent
                const parentRoute = mapByName[parentName]

                if (parentRoute) {

                    if (route.path === '') {
                        parentRoute.name = ''
                    }

                    ctx.parent = parentRoute.path.replace(/\/+$/, '');

                    this.buildRoute(route, ctx)

                    if (!parentRoute.children)
                        parentRoute.children = []

                    parentRoute.children.push(route)
                }
            } else {
                this.buildRoute(route, ctx)
                res.push(route)
            }
        }

        console.log(res)

        return res
    }

    buildRoute(route, ctx) {
        if (route.path) {
            route.path = route.path.replace(
                /{(\w*)}/g, // or /{(\w*)}/g for "{this} instead of %this%"
                function (m, key) {
                    return ctx[key]
                }
            );
        }
        if (route.name)
            this.routesBuildedMap[route.name] = route
    }

    getRouteByName(routeName, field) {
        const route = this.routesBuildedMap[routeName]
        if (route) {
            return field ? route[field] : route
        }
    }

    getRoutePath(routeName, replaces = {}) {
        const route = this.routesBuildedMap[routeName]
        if (route) {
            const regex = new RegExp(Object.keys(replaces).join('|'), "g");
            return route.path.replace(regex, (key) => {
                return replaces[key]
            });
        }
    }

    createContext(ctx, scope) {

        const config = scope.config
        const emitter = scope.emitter
        const registry = scope.registry
        const container = scope.container

        const inject = (ctx, path, value, serverOnly = false) => {

            deepSet(ctx, path, value)

            if (!serverOnly) {
                if (ctx.Vue)
                    deepSet(ctx.Vue.prototype, path, value)

                if (ctx.store)
                    deepSet(ctx.store, path, value)
            }
        }

        const injectExtend = (ctx, path, ext) => {

            const value = deepGet(ctx, path) || {}

            Object.assign(value, ext)

            deepSet(ctx, path, value)

            if (ctx.Vue)
                deepSet(ctx.Vue.prototype, path, value)

            if (ctx.store)
                deepSet(ctx.store, path, value)
        }


        ctx.injectExtend = (path, value) => {
            injectExtend(ctx, path, value)
        }

        ctx.inject = (path, value, serverOnly) => {
            inject(ctx, path, value, serverOnly)
        }

        ctx.toRequest = (requestCtx) => {

            Object.keys(ctx).forEach((key) => {
                if (key.charAt(0) === '$') {
                    requestCtx[key] = ctx[key]
                    if (requestCtx.store) {
                        requestCtx.store[key] = ctx[key]
                    }
                }
            })

            requestCtx.inject = (path, value, serverOnly) => {
                inject(requestCtx, path, value, serverOnly)
            }
        }

        ctx.inject('$emitter', emitter)
        ctx.inject('$config', config)
        ctx.inject('$registry', registry)
        ctx.inject('$container', container)
        ctx.inject('$app', this)

        this.context = ctx

        return ctx
    }

    addFilter(name, cb) {
        this.hooks[name] = this.hooks[name] || []
        this.hooks[name].push(cb)
    }

    isDev() {
        return process.env.DEV
    }

    component(name, module) {
        this.components[name] = true
        this.context.Vue.component(name, module)
    }

    componentSuggest(name, def = null) {
        const names = Array.isArray(name) ? name : [name]
        return names.find(name => !!this.components[name]) || def
    }
}
