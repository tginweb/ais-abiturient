
export async function prefetchPageData(mode, _ctx, cb, pageData) {

    pageData = pageData || {}

    let ctx = mode === 'static' ? {
        apolloClient: _ctx.store.apollo.defaultClient,
        route: _ctx.currentRoute,
        store: _ctx.store,
        axios: _ctx.store.$axios
    } : {
        apolloClient: _ctx.$apollo,
        route: _ctx.vroute,
        store: _ctx.$store,
    }

    pageData.routeId = ctx.route.path

    return cb(pageData, ctx)
}


export default async function setPageData(mode, _ctx, cb, pageData) {

    pageData = pageData || {}

    let ctx = mode === 'static' ? {
        apolloClient: _ctx.store.apollo.defaultClient,
        route: _ctx.currentRoute,
        store: _ctx.store,
        axios: _ctx.store.$axios
    } : {
        apolloClient: _ctx.$apollo,
        route: _ctx.$route,
        store: _ctx.$store,
    }

    ctx.redirect = _ctx.redirect

    pageData.routeId = ctx.route.path

    pageData = await cb(pageData, ctx)

    await ctx.store.dispatch('router/setPageData', pageData)
}
