const loaders = []

export function boot({Vue}) {

}

export async function request(ctx) {
    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function store(modules) {
    modules.edu_campaign = require('./store').default
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            parent: 'admin',
            path: '{parent}/edu/campaign/list',
            component: () => import('./routes/entities-list'),
        },
        /*
      {
        parent: 'admin',
        name: 'edu-org-campaign-sync',
        path: '{parent}/edu/campaign/sync',
        component: () => import('./routes/entities-sync'),
        props: true
      },
      {
        parent: 'admin',
        name: 'edu-org-campaign-view',
        path: '{parent}/edu/campaign/entity/:entityId/view',
        component: () => import('./routes/entity-view'),
        props: true
      },
         */
    ]);

}
