import triggerWindowResize from '../../common/lib/util/base/triggerWindowResize'
import Vue from 'vue'

export function assignPageData(context, data) {
    context.commit('assignPageData', data)
}

export function setPageData(context, data) {
    context.commit('setPageData', data)
}

export function setPageRouteData(context, data) {
    context.commit('setPageRouteData', data)
}

export function setBackLink(context, data) {
    context.commit('SET_BACK_LINK', data);
}

export function setPageInfo(context, data) {
    context.commit('SET_PAGE_INFO', data);
}

export function navPromised(context, data) {

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

        await context.dispatch('nav', ctx)

    })
}

export function setQueryNav(context, ctx) {
    context.commit('QUERY_NAV', ctx)
}

export function setRoute(context, ctx) {
    context.commit('ROUTE', ctx)
}

export function vrouterNav(context, params) {
    if (params.replace) {
        context.commit('VROUTER_REPLACE', params);
    } else {

        let found = false

        if (params.url) {
            found = context.state.vroutes.find(item => item.url === params.url)
        }

        if (!found) {
            context.commit('VROUTER_PUSH', params)
        }
    }
}

export function vrouterPushAfter(context, params) {
    context.commit('VROUTER_PUSH_AFTER', params)
}

export function vrouterPush(context, params) {
    context.commit('VROUTER_PUSH', params)
}

export function vrouterReplace(context, params) {
    context.commit('VROUTER_REPLACE', params)
}

export function vrouterBeforeClose(context) {

}

export function vrouterClose(context) {
    context.commit('VROUTER_CLOSE')
}

export function fixWindow(context, delay) {
    if (delay) {
        if (delay === true)
            delay = 50
        setTimeout(() => {
            triggerWindowResize()
        }, delay)
    } else {
        triggerWindowResize()
    }
}
