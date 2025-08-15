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
    modules.sale_admin = require('./store').default
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            name: 'sale:profiles',
            parent: 'admin',
            path: '{parent}/sale/profiles',
            component: () => import('./routes/profiles'),
            props: true,
            meta: {}
        },
        {
            name: 'sale:profile.view',
            parent: 'admin',
            path: '{parent}/sale/profile/:entityId',
            component: () => import('./routes/profile'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                    replace: ({store}) => {
                        return store.getters['router/vrouterRouteName'] === 'sale:profile.edit'
                    }
                }
            }
        },
        {
            name: 'sale:profile.edit',
            parent: 'admin',
            path: '{parent}/sale/profile/:entityId/edit',
            component: () => import('./routes/profile-edit'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                    replace: ({store}) => {
                        return store.getters['router/vrouterRouteName'] === 'sale:profile.view'
                    }
                }
            }
        },
        {
            name: 'sale:vorders',
            parent: 'admin',
            path: '{parent}/sale/vorders',
            component: () => import('./routes/vorders'),
            props: true,
            meta: {}
        },
        {
            name: 'sale:vorder',
            parent: 'admin',
            path: '{parent}/sale/vorder/:entityId',
            component: () => import('./routes/vorder'),
            props: true,
            meta: {
                vroute: true
            }
        },

        {
            name: 'sale:vorder-reserves',
            parent: 'admin',
            path: '{parent}/sale/vorder-reserve',
            component: () => import('./routes/vorder-reserves'),
            props: true,
            meta: {}
        },
        {
            name: 'sale:vorder-reserve',
            parent: 'admin',
            path: '{parent}/sale/vorder-reserve/:entityId',
            component: () => import('./routes/vorder-reserve'),
            props: true,
            meta: {
                vroute: true
            }
        },

        {
            name: 'sale:orders.stat',
            parent: 'admin',
            path: '{parent}/sale/orders/stat/:viewId?',
            component: () => import('./routes/orders-stat'),
            props: true,
            meta: {}
        },
        {
            name: 'sale:orders',
            parent: 'admin',
            path: '{parent}/sale/orders/:viewId?',
            component: () => import('./routes/orders'),
            props: true,
            meta: {}
        },
        {
            name: 'sale:order.view',
            parent: 'admin',
            path: '{parent}/sale/order/:entityId/view',
            component: () => import('./routes/order-view'),
            props: true,
            meta: {
                vroute: true
            }
        },
        {
            name: 'sale:order.set-status',
            parent: 'admin',
            path: '{parent}/sale/order/:entityId/set-status',
            component: () => import('./routes/order-status'),
            props: true,
            meta: {
                vroute: true,
            }
        },
        {
            name: 'sale:order.event',
            parent: 'admin',
            path: '{parent}/sale/order/:entityId/event',
            component: () => import('./routes/order-event'),
            props: true,
            meta: {
                vroute: true,
            }
        },
        {
            name: 'sale:paycards',
            parent: 'admin',
            path: '{parent}/sale/paycards',
            component: () => import('./routes/paycards'),
            props: true,
            meta: {}
        },
        {
            name: 'sale:paycard',
            parent: 'admin',
            path: '{parent}/sale/paycard/:entityId',
            component: () => import('./routes/paycard'),
            props: true,
            meta: {
                vroute: true
            }
        },
        {
            name: 'sale:paycard-auths',
            parent: 'admin',
            path: '{parent}/sale/paycard-auths',
            component: () => import('./routes/paycard-auths'),
            props: true,
            meta: {}
        },
        {
            name: 'sale:paycard-payments',
            parent: 'admin',
            path: '{parent}/sale/paycard-payments',
            component: () => import('./routes/paycard-payments'),
            props: true,
            meta: {}
        },
        {
            name: 'sale:paycard-payment',
            parent: 'admin',
            path: '{parent}/sale/paycard-payment/:entityId',
            component: () => import('./routes/paycard-payment'),
            props: true,
            meta: {
                vroute: true
            }
        },
    ]);

}
