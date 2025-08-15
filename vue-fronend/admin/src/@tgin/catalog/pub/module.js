export function register(ctx) {
    return {
        routeParent: 'public',
        urlConstructor: '/constructor/',
        urlFavorites: '/favorites/',
        urlHistory: '/history/',
        urlSearch: '/catalog/search/',
        urlSearchPopup: '/catalog/search.popup/',

        routeCatalog: {},
        routeSection: {},
        routeElement: {},
        routeElementPopup: {},
        routeElementOrder: {},

        ...ctx,
    }
}

const loaders = [
    require('./loaders/components'),
    //require('./loaders/filters'),
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
    modules.catalog_pub = require('./store').default
}

export function routes(routes) {

    let options = this.options

    const entityTypes = this.$app.context.$entityRegistry.getEntityTypesByRole('catalog')

    options.catalogs.forEach(catalog => {

        let entityTypeInfo

        if (catalog.iblockCode)
            entityTypeInfo = entityTypes.find(item => item.driver.code === catalog.iblockCode)

        if (catalog.iblockId)
            entityTypeInfo = entityTypes.find(item => item.driver.id === catalog.iblockId)

        if (!entityTypeInfo)
            return;

        const ibRouter = this.$app.context.$entityRegistry.getIblockRouter(entityTypeInfo)


        Array.prototype.push.apply(routes, [

            {
                disable: !ibRouter.urls.index,
                name: 'catalog.' + ibRouter.id + '.constructor',
                parent: catalog.routeParent,
                path: ibRouter.urls.index + 'constructor/:sectionCode',
                props: route => {
                    return {
                        sectionCode: route.params.sectionCode,
                        iblock: ibRouter.key
                    }
                },
                component: () => import('./routes/catalog-constructor.vue'),
                ...options.routeCatalog,
                meta: {
                    vroute: {
                        breakpoint: 'lg',
                    }
                }
            },
            {
                disable: !ibRouter.urls.index,
                name: 'catalog.' + ibRouter.id + '.index',
                parent: catalog.routeParent,
                path: ibRouter.urls.index,
                props: {iblock: ibRouter.key},
                component: () => import('./routes/catalog.vue'),
                ...options.routeCatalog
            },
            {
                disable: !ibRouter.urls.index,
                name: 'catalog.' + ibRouter.id + '.set',
                parent: catalog.routeParent,
                path: ibRouter.urls.index + 'all/:set?',
                props: {iblock: ibRouter.key},
                component: () => import('./routes/catalog-section.vue'),
                ...options.routeSection
            },
            {
                disable: !ibRouter.urls.section,
                name: 'catalog.' + ibRouter.id + '.section',
                parent: catalog.routeParent,
                path: ibRouter.urls.section,
                props: {iblock: ibRouter.key},
                component: () => import('./routes/catalog-section.vue'),
                meta: {role: 'catalog:section'},
                ...options.routeSection
            },
            {
                disable: !ibRouter.urls.detail,
                name: 'catalog.' + ibRouter.id + '.element',
                parent: catalog.routeParent,
                path: ibRouter.urls.detail,
                props: route => {
                    return {
                        ...route.params,
                        iblock: ibRouter.key
                    }
                },
                component: () => import('./routes/catalog-element.vue'),
                meta: {
                    vroute: {
                        breakpoint: 'md',
                        is: require('./routes/catalog-element-popup.vue').default,
                    }
                },
                ...options.routeElement,
            },
            {
                disable: !ibRouter.urls.detail,
                name: 'catalog.' + ibRouter.id + '.element.popup',
                parent: catalog.routeParent,
                path: '/catalog/element-popup/:entityId',
                props: true,
                component: () => import('./routes/catalog-element-popup.vue'),
                ...options.routeElementPopup,
                meta: {
                    vroute: {
                        enable: true
                    }
                }
            },
            {
                name: 'catalog.' + ibRouter.id + '.element.order',
                parent: catalog.routeParent,
                path: '/catalog/element-order/:entityId',
                props: true,
                component: () => import('./routes/catalog-element-order.vue'),
                ...options.routeElementOrder,
                meta: {
                    vroute: {
                        enable: true
                    }
                }
            },
        ]);

    })

    Array.prototype.push.apply(routes, [
        {
            name: 'catalog.history',
            parent: options.routeParent,
            path: options.urlHistory,
            component: () => import('./routes/history.vue')
        },
        {
            name: 'catalog.search',
            parent: options.routeParent,
            path: options.urlSearch,
            component: () => import('./routes/search.vue')
        },
        {
            name: 'catalog.search.popup',
            parent: options.routeParent,
            path: options.urlSearchPopup,
            component: () => import('./routes/search-popup.vue'),
            meta: {
                vroute: {
                    enable: true
                }
            }
        },
    ]);

}

export function scopeQuery(query, name) {

    switch (name) {
        case 'sess':
            query = query.add(require('./gql/scope/sess.gql'), {})
            break
    }

    return query
}


