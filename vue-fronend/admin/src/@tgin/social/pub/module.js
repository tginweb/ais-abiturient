export function register(ctx) {
    return {

    }
}

const loaders = [
    require('./loaders/components'),
]

export function boot(ctx) {
    loaders.forEach((loader) => {
        loader.boot(ctx);
    })
}

export function store(modules) {

}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            name: 'social:share',
            parent: 'public',
            path: '/social/share',
            component: () => import('./routes/share.vue'),
            props: true,
            meta: {
                vroute: true
            }
        },
    ]);

}


