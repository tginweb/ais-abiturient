export function boot({Vue}) {

}

export async function request(ctx) {

}

export function store(modules) {
    modules.user_admin = require('./store').default;
}

export function scopeQuery(query, name) {
    switch (name) {
        case 'app':
            query = query.add(require('./gql/scope/app.gql'), {})
            break
    }
    return query
}


export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            name: 'test',
            parent: 'admin',
            path: '/test',
            component: () => import('./routes/test'),
            props: true,
        },
        {
            name: 'user:auth',
            parent: 'pub',
            path: '{parent}/auth',
            component: () => import('./routes/auth'),
            props: true,
            meta: {
                vroute: true
            }
        },
        {
            name: 'user:logout',
            parent: 'admin',
            path: '{parent}/logout',
            component: () => import('./routes/logout'),
            props: true,
            meta: {
                vroute: true
            }
        },
        {
            name: 'user:user.list',
            parent: 'admin',
            path: '{parent}/users',
            component: () => import('./routes/users'),
        },
        {
            name: 'user:user.view',
            parent: 'admin',
            path: '{parent}/user/:entityId/view',
            component: () => import('./routes/user'),
            props: true,
            meta: {
                vroute: true
            }
        },

    ]);

}


