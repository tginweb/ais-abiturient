const loaders = [
    require('./loaders/components'),
]

export function boot(ctx) {
    loaders.forEach((loader) => {
        loader.boot(ctx);
    })
}

export async function request(ctx) {

}

export function routes(routes) {

    let options = {
        routeFolder: '/faq',
        routeParent: 'public',
        title: 'Вопрос',
        titlePlural: 'Вопросы',
        ...this.options
    }

    Array.prototype.push.apply(routes, [
        {
            name: 'faq.elements',
            parent: options.routeParent,
            path: options.routeFolder,
            component: () => import('./routes/elements.vue'),
            props: true,
            meta: {
                title: options.titlePlural,
            }
        },
        {
            name: 'faq.elements.category',
            parent: options.routeParent,
            path: options.routeFolder + '/category/:sectionCode?',
            component: () => import('./routes/elements.vue'),
            props: true,
            meta: {
                title: options.titlePlural,
            }
        },
        {
            name: 'faq.element',
            parent: options.routeParent,
            path: options.routeFolder + '/:element',
            component: () => import('./routes/element.vue'),
            meta: {
                title: options.title,
            }
        },
    ]);

}


