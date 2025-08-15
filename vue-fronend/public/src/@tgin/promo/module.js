export function register(ctx) {
    return {
        entityType: 'promo',
        routeFolder: '/promo',
        routeParent: 'public',
        title: 'Акция',
        titlePlural: 'Акции',
        ...ctx,
    }
}

export function children(ctx) {
    return [
        [require('./core/module'), ctx],
        [require('./pub/module'), 'pub', ctx],
    ]
}
