export function boot({Vue}) {

}

export async function request(ctx) {

}

export function store(modules) {
    modules.user_admin = require('./store').default;
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
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
            path: '{parent}/user/:entityId',
            component: () => import('./routes/user'),
            props: true,
            meta: {
                vroute: true
            }
        },
    ]);

}


