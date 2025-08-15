export function register(ctx) {
    return {
        entityType: 'banner',
        routeFolder: '/banner',
        routeParent: 'public',
        title: 'Баннер',
        titlePlural: 'Баннеры',
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


}


