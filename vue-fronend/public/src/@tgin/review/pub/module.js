export function register(ctx) {
    return {
        entityType: 'review',
        routeFolder: '/review',
        routeParent: 'public',
        title: 'Отзыв',
        titlePlural: 'Отзывы',
        ...ctx,
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

export async function request(ctx) {
    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function store(modules) {
    modules.review_pub = require('./store').default;
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            parent: 'personal',
            path: '{parent}/reviews',
            component: () => import('./routes/personal/reviews')
        },

        {
            path: '/reviews/product',
            parent: 'public',
            component: () => import('./routes/product-reviews')
        },

        {
            name: 'review:product.add',
            path: '{parent}/review/product/add/:entityId',
            component: () => import('./routes/personal/product-review'),
            props: (route) => {
                return {
                    ...route.params,
                    action: 'add'
                }
            },
            meta: {
                guards: {
                    user: {}
                },
                vroute: true
            }
        },
        {
            name: 'review:product.edit',
            path: '{parent}/review/product/edit/:entityId',
            component: () => import('./routes/personal/product-review'),
            props: (route) => {
                return {
                    ...route.params,
                    action: 'edit'
                }
            },
            meta: {
                guards: {
                    user: {}
                },
                vroute: true
            }
        },

        {
            name: 'review:order.add',
            path: '{parent}/order/:entityId/review',
            component: () => import('./routes/personal/order-review'),
            props: true,
            meta: {
                guards: {
                    user: {}
                },
                vroute: true
            }
        },
    ]);
}


