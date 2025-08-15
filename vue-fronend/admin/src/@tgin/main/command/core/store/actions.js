import {Dialog} from 'quasar'


export const deepGet = require('lodash/get')

export function runPromised(context, data) {

    let ctx = {}

    if (typeof data === 'function') {
        ctx.callback = data
        return
    } else if (typeof data === 'string') {
        ctx.path = data
    } else {
        ctx = data
    }

    return new Promise(async (resolve, reject) => {

        if (data.nonav) {
            resolve()
            return
        }

        const cb = ctx.onResolve;

        ctx.onResolve = (result) => {

            resolve(result)

            if (cb)
                cb(result);
        }

        await context.dispatch('run', ctx)

    })
}

export function runMenuItem(context, item) {

    let command = item.command || {}

    const fields = {
        'type': 'type',
        'url': 'path',
        'path': 'path',
        'args': 'args',
        'callback': 'callback',
        'onResolve': 'onResolve',

        'native': 'native',
        'confirm': 'confirm',
        'blank': 'blank',
    }

    for (const [field, tofield] of Object.entries(fields)) {
        if (item[field] && !command[field]) {
            command[tofield] = item[field];
        }
    }

    context.dispatch('run', command)
}

export function run(context, data) {


    let ctx = {}

    if (typeof data === 'function') {
        ctx.callback = data
        return
    } else if (typeof data === 'string') {
        ctx.path = data
    } else {
        ctx = {
            ...data
        }
    }

    let screen

    if (window.innerWidth < 600) {
        screen = 'phone'
    } else if (window.innerWidth < 1080) {
        screen = 'tablet'
    } else {
        screen = 'desktop'
    }

    for (const [key, val] of Object.entries(ctx)) {
        if (!val)
            delete ctx[key]
    }

    this.$bus.emit('command', ctx)

    let args = ctx.args || {}

    args = typeof args === 'function' ? args() : args

    if (ctx.code) {

        let commandInfo = context.getters['commandsByCode'][ctx.code]

        if (commandInfo) {

            for (const [key, val] of Object.entries(commandInfo))
                if (!val) delete commandInfo[key]

            ctx = {
                ...ctx,
                ...commandInfo,
            }

            let commandInfoScreen

            if (commandInfo[screen]) {
                commandInfoScreen = {
                    ...commandInfo[screen]
                }
            } else if (screen !== 'desktop' && commandInfo.mobile) {
                commandInfoScreen = {
                    ...commandInfo.mobile
                }
            }

            if (commandInfoScreen) {

                for (const [key, val] of Object.entries(commandInfoScreen)) {
                    if (!val)
                        delete commandInfoScreen[key]
                }

                ctx = {
                    ...ctx,
                    ...commandInfoScreen,
                }
            }

        }

        //this.$bus.emit('command:' + ctx.code, ctx)
    }

    const cbTemplate = (str, vars) => {
        return str.replace(
            /\#(\w*)\#/g,
            function (m, key) {
                return vars[key]
            }
        )
    }

    if (typeof ctx.path === 'string') {
        ctx.path = cbTemplate(ctx.path, args)
    }

    const onResolve = ctx.onResolve

    ctx.onResolve = (data) => {

        let result

        if (data) {
            result = data.result || deepGet(data, 'data.res.result') || deepGet(data, 'extensions.result')

            if (result) {
                this.$bus.emit('processMessages', result.messages);
            }
        }

        if (onResolve) {
            onResolve(result)
        }

    }

    const run = () => {

        const routerQueryParams = {
            onResolve: ctx.onResolve,
            onReject: ctx.onReject,
        }

        if (!ctx.type) {
            if (ctx.callback)
                ctx.type = 'callback'
        }

        switch (ctx.type) {

            case 'dispatch':

                context.dispatch(ctx.path, args, {root: true}).then((result) => {
                    if (ctx.onResolve) {
                        ctx.onResolve(result)
                    }
                }).catch((e) => {
                    console.log(e)
                    if (ctx.onReject) {
                        ctx.onReject(e)
                    }
                })

                break;

            case 'callback':

                const res = ctx.callback(args)

                if (ctx.onResolve) {
                    ctx.onResolve(res)
                }

                break;

            case 'vroute':

                context.dispatch('router/vrouterNav', {
                    is: ctx.path,
                    props: {
                        ...routerQueryParams,
                        ...args,
                    }
                }, {root: true})

                break

            case 'vrouter':

                this.$router.push({
                    path: ctx.path,
                    query: {
                        ...routerQueryParams,
                        ...args,
                        vroute: ctx.vroute || 1
                    }
                })

                break
            case 'router':
            default:

                if (ctx.native) {
                    if (ctx.blank) {
                        window.open(ctx.path, '_blank').focus()
                    } else {
                        window.location.replace(ctx.path)
                    }
                } else {
                    let route = typeof ctx.path === 'object' ? ctx.path : {path: ctx.path}

                    this.$router.push({
                        ...route,
                        params: args,
                        query: {
                            ...routerQueryParams,
                            ...args
                        }
                    }).catch(() => {
                    })
                }

                break
        }
    }

    if (ctx.confirm) {
        Dialog.create({
            title: 'Подтвердить',
            message: typeof ctx.confirm === 'string' ? ctx.confirm : 'Подтвердить',
            cancel: true
        }).onOk(() => {
            run();
        }).onCancel(() => {

            if (ctx.onCancel) {
                ctx.onCancel()
            }
        })

    } else {
        try {
            run()
        } catch (e) {
            console.log(e)
        }
    }
}
