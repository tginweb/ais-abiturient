const loaders = []

export function boot({Vue}) {


}

export async function request(ctx) {
    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function store(modules) {
    modules.logger_admin = require('./store').default
}

export function routes(routes) {

    routes.push({
        name: 'logger:events',
        parent: 'admin',
        path: '{parent}/logger/events/:viewId?',
        component: () => import('./routes/events'),
        props: true,
        meta: {
            vroute: {
                enable: false,
            }
        }
    })

    routes.push({
        name: 'logger:event',
        parent: 'admin',
        path: '{parent}/logger/event/:entityId',
        component: () => import('./routes/event'),
        props: true,
        meta: {
            vroute: {
                enable: true,
            }
        }
    })
}
