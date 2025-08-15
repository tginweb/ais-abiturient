const loaders = []

export function boot({Vue}) {


}

export async function request(ctx) {
    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function store(modules) {
    modules.tagger_admin = require('./store').default
}

export function routes(routes) {

    routes.push({
        name: 'tagger:tags',
        parent: 'admin',
        path: '{parent}/tagger/tag/list',
        component: () => import('./routes/tags'),
        props: true,
        meta: {
            vroute: {
                enable: false,
            }
        }
    })

    routes.push({
        name: 'tagger:tag.create',
        parent: 'admin',
        path: '{parent}/tagger/tag/create',
        component: () => import('./routes/tag'),
        props: {action: 'create'},
        meta: {
            vroute: {
                enable: true,
            }
        }
    })

    routes.push({
        name: 'tagger:tag.edit',
        parent: 'admin',
        path: '{parent}/tagger/tag/:entityId',
        component: () => import('./routes/tag'),
        props: true,
        meta: {
            vroute: {
                enable: true,
            }
        }
    })
}
