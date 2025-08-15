const loaders = [
    require('./loaders/components'),
]

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
    modules.catalog_admin = require('./store').default
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            name: 'catalog:products',
            parent: 'admin',
            path: '{parent}/catalog/:iblock/products',
            component: () => import('./routes/products'),
            props: true,
            meta: {}
        },
        {
            name: 'catalog:product',
            parent: 'admin',
            path: '{parent}/catalog/:iblock/product/:entityId',
            component: () => import('./routes/product'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },

        {
            name: 'catalog:favs',
            parent: 'admin',
            path: '{parent}/catalog/favs',
            component: () => import('./routes/favs'),
            props: true,
            meta: {}
        },
        {
            name: 'catalog:fav',
            parent: 'admin',
            path: '{parent}/catalog/fav/:entityId',
            component: () => import('./routes/fav'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
    ]);

}
