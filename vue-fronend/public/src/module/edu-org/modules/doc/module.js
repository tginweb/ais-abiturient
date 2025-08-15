const loaders = []

export function scopeQuery(query, name) {

    switch (name) {
        case 'app':
            query = query.add(require('./gql/scope/app.gql'), {})
            break
    }

    return query
}

export function boot({Vue}) {
    Vue.component('edu-doc-uploader', require('./component/uploader').default);
    Vue.component('edu-doc-public-embed', require('./component/public-embed').default);
}

export async function request(ctx) {
    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function store(modules) {
    modules.edu_doc = require('./store').default
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            parent: 'admin',
            path: '{parent}/edu/doc/list',
            component: () => import('./routes/items-list'),
        },
        {
            name: 'edu.doc:edit',
            parent: 'cab',
            path: '{parent}/edu/doc/:entityId/edit',
            component: () => import('./routes/edit'),
            props: (route) => {
                return {
                    ...route.params,
                    action: 'edit'
                }
            },
            meta: {
                vroute: true
            }
        },
        {
            name: 'edu.doc:create',
            parent: 'cab',
            path: '{parent}/edu/doc/create',
            component: () => import('./routes/edit'),
            props: (route) => {
                return {
                    orderId: route.query.orderId,
                    action: 'create',
                    ...(route.params || {})
                }
            },
            meta: {
                vroute: true
            }
        },
    ]);


}
