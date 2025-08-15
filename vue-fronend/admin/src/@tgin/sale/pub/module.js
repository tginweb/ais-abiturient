export function register(ctx) {
    return {
        urlBasket: '/cart',
        basketRouteParent: 'public',

        orderMakeRouteParent: 'public-clean',
        orderMakeUrl: '/order/',

        routeBasketDialog: {},
        routeOrderMake: {},

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

export function routes(routes) {

    const options = this.options

    Array.prototype.push.apply(routes, [
        {
            name: 'sale:favorites',
            parent: 'personal',
            path: '{parent}/favorites',
            component: () => import('./routes/personal/favorites')
        },
        {
            name: 'sale:basket.dialog',
            parent: options.basketRouteParent,
            path: '{parent}/basket-dialog',
            component: () => import('./routes/basket-dialog'),
            meta: {
                vroute: true
            },
            ...options.routeBasketDialog
        },
        {
            name: 'sale:basket',
            parent: options.basketRouteParent,
            path: options.urlBasket + '/',
            component: () => import('./routes/basket.vue'),
            meta: {basketHide: true}
        },
        {
            name: 'sale:basket.clear',
            parent: options.basketRouteParent,
            path: options.urlBasket + '/clear',
            component: () => import('./routes/basket-clear'),
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'sale:order-make',
            parent: options.orderMakeRouteParent,
            path: options.orderMakeUrl,
            component: () => import('./routes/order-make'),
            meta: {
                basketHide: true,
            }
        },
        {
            name: 'sale:orders',
            parent: 'personal',
            path: '{parent}/order',
            component: () => import('./routes/personal/orders'),
            meta: {
                label: 'Заказы'
            }
        },
        {
            name: 'sale:order.public',
            parent: 'public',
            path: '/order-public',
            component: () => import('./routes/order-success')
        },
        {
            name: 'sale:order.view',
            parent: 'personal',
            path: '{parent}/order/:entityId',
            component: () => import('./routes/personal/order.vue'),
            props: true,
            meta: {
                vroute: {
                    breakpoint: 'md',
                    is: require('./routes/personal/order-dialog.vue').default
                }
            }
        },
        {
            name: 'sale:order.cancel',
            parent: 'personal',
            path: '{parent}/order/:entityId/cancel',
            component: () => import('./routes/personal/order-cancel.vue'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'sale:order.repeat',
            parent: 'personal',
            path: '{parent}/order/:entityId/repeat',
            component: () => import('./routes/personal/order-repeat.vue'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'sale:profile.add',
            parent: 'personal',
            path: '{parent}/order-profile/add/:personTypeId?',
            component: () => import('./routes/personal/profile-edit'),
            props: (route) => {
                console.log('TTT NEW')
                console.log(route.params)

                return {
                    action: 'create',
                    ...route.params,
                    personTypeId: 2
                }
            },
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'sale:profile.edit',
            parent: 'personal',
            path: '{parent}/order-profile/:entityId/edit',
            component: () => import('./routes/personal/profile-edit'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'sale:profiles',
            parent: 'personal',
            path: '{parent}/order-profiles',
            component: () => import('./routes/personal/profiles'),
            meta: {
                vroute: {
                    breakpoint1: 'lg',
                }
            }
        },
        {
            name: 'sale:certificates',
            parent: 'personal',
            path: '{parent}/certificates',
            component: () => import('./routes/personal/certificates'),
            meta: {
            }
        },
        {
            name: 'sale:buyer.companies',
            parent: 'personal',
            path: '{parent}/buisness',
            component: () => import('./routes/personal/buyer/companies'),
            meta: {
            }
        },
        {
            name: 'sale:buyer.company.add',
            parent: 'personal',
            path: '{parent}/buyer-company/add',
            component: () => import('./routes/personal/buyer/company-edit'),
            props: {action: 'create'},
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'sale:buyer.company.edit',
            parent: 'personal',
            path: '{parent}/buyer-company/:entityId/edit',
            component: () => import('./routes/personal/buyer/company-edit'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'sale:buyer.company.view',
            parent: 'personal',
            path: '{parent}/buyer-company/:entityId',
            component: () => import('./routes/personal/buyer/company'),
            props: true,
            meta: {
                vroute: {
                    breakpoint: 'lg',
                    is: require('./routes/personal/buyer/company-dialog.vue').default
                }
            }
        },
        {
            name: 'sale:payment.cards',
            parent: 'personal',
            path: '{parent}/payment-cards',
            component: () => import('./routes/personal/payment-cards'),
            meta: {
                vroute: {
                    breakpoint1: 'lg',
                }
            }
        },
        {
            name: 'sale:address-map',
            parent: 'public',
            path: '{parent}/sale-address-map',
            props: true,
            component: () => import('./routes/address-map'),
            meta: {
                vroute: true
            }
        },
        {
            name: 'sale:bonus',
            parent: 'personal',
            path: '{parent}/bonus',
            props: true,
            component: () => import('./routes/personal/bonus'),
            meta: {

            }
        },
    ]);

}

export function store(modules) {
    modules.sale_pub = require('./store').default;
}

export function scopeQuery(query, name) {

    switch (name) {
        case 'sess':
             query = query.add(require('./gql/scope/sess.gql'), {})
            break
        case 'user':
            query = query.add(require('./gql/scope/user.gql'), {})
            break
    }

    return query
}


