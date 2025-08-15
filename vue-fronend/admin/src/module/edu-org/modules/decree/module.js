const loaders = []

export function boot({Vue}) {

}

export async function request(ctx) {
    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function store(modules) {
    modules.edu_decree = require('./store').default
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            parent: 'admin',
            path: '{parent}/edu/decree/list',
            component: () => import('./routes/entities-list'),
        },
        /*
      {
        parent: 'admin',
        name: 'edu-org-decree-sync',
        path: '{parent}/edu/decree/sync',
        component: () => import('./routes/entities-sync'),
        props: true
      },
      {
        parent: 'admin',
        name: 'edu-org-decree-view',
        path: '{parent}/edu/decree/entity/:entityId/view',
        component: () => import('./routes/entity-view'),
        props: true
      },
         */
    ]);

}
