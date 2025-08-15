export function boot({Vue}) {

}

export async function request(ctx) {

}

export function store(modules) {
    modules.user_pub = require('./store').default;
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            name: 'user:auth',
            parent: 'pub',
            path: '/pub/auth',
            component: () => import('./routes/auth'),
            props: true,
        },
    ]);

}


