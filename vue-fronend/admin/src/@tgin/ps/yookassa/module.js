const loaders = []

export function boot(ctx) {
    loaders.forEach((loader) => {
        loader.boot(ctx);
    })
}

export async function request(ctx) {
    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function store(modules) {

}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            name: 'ps.yookassa:pay',
            path: '/ps/pay/yookassa/:entityId',
            parent: 'public',
            component: () => import('./routes/pay'),
            props: true,
            meta: {
                vroute: true
            }
        },
        {
            name: 'ps.yookassa:auth',
            path: '/ps/yookassa/auth',
            parent: 'public',
            component: () => import('./routes/auth'),
            props: true,
            meta: {
                vroute: true
            }
        },
    ]);
}


