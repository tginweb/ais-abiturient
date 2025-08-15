export function register(ctx) {
    return {
        entityType: 'post',
        routeFolder: '/post',
        routeParent: 'public',
        title: 'Новость',
        titlePlural: 'Новости',
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

}

export function routes(routes) {

    let options = this.options

    const entityTypeInfo = this.$app.context.$entityRegistry.getEntityType('iblock', 'post', 'code')

    if (!entityTypeInfo)
        return;

    const ibRouter = this.$app.context.$entityRegistry.getIblockRouter(entityTypeInfo)

    Array.prototype.push.apply(routes, [
        {
            disable: !ibRouter.urls.detail,
            name: 'post.element',
            parent: options.routeParent,
            path: ibRouter.urls.detail,
            component: () => import('./routes/element.vue'),
            props: true,
            meta: {
                title: options.title,
                entityType: options.entityType,
            }
        },
        {
            disable: !ibRouter.urls.index,
            name: 'post.elements',
            parent: options.routeParent,
            path: ibRouter.urls.index,
            component: () => import('./routes/elements.vue'),
            props: true,
            meta: {
                title: options.titlePlural,
                entityType: options.entityType,
            }
        },
        {
            disable: !ibRouter.urls.section,
            name: 'post.elements.category',
            parent: options.routeParent,
            path: ibRouter.urls.section,
            component: () => import('./routes/elements.vue'),
            props: true,
            meta: {
                title: options.titlePlural,
                entityType: options.entityType,
            }
        },

    ]);

}


