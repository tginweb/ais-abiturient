import Client from "./lib/Client";

const loaders = []

export function boot(ctx) {
    loaders.forEach((loader) => {
        loader.boot(ctx);
    })
}

export async function request(ctx) {

    if (!process.env.SERVER) {
        ctx.inject('$ws', new Client(ctx))
    }

    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function store(modules) {

    //modules.i18n = require('./store').default
}


export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            path: '/socket',
            parent: 'public',
            component: () => import('./routes/socket')
        },
    ]);
}


