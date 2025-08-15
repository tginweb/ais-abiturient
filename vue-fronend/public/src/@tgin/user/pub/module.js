const loaders = []

export function boot(ctx) {
    loaders.forEach((loader) => {
        loader.boot(ctx);
    })

    ctx.Vue.component('tpl-page-view-personal', () => import('./component/profile/page'))
    ctx.Vue.component('user-profile-widget', () => import('./component/profile/widget/widget'))
}

export async function request(ctx) {
    loaders.forEach((loader) => {
        loader.request(ctx);
    })
}

export function routes(routes) {

    Array.prototype.push.apply(routes, [
        {
            name: 'user:auth',
            parent: 'public',
            path: '{parent}/auth',
            component: () => import('./routes/auth'),
            props: true,
            meta: {
                vroute: true
            }
        },
        {
            name: 'user:personal.root',
            parent: 'personal',
            path: '{parent}/',
            redirect: {name: 'user:personal'},
        },
        {
            name: 'user:personal',
            parent: 'personal',
            path: '{parent}/dashboard',
            component: () => import('./routes/private/dashboard'),
            props: true,
        },
        {
            name: 'user:menu',
            parent: 'personal',
            path: '{parent}/menu',
            component: () => import('./routes/private/menu'),
            props: true,
            meta: {
                vroute: {
                    breakpoint: 'lg',
                    disabledRedirect: {name: 'user:personal'},
                }
            }
        },
        {
            name: 'user:profile.edit',
            parent: 'personal',
            path: '{parent}/profile-edit',
            component: () => import('./routes/private/edit'),
            props: true,
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'user:profile.edit-avatar',
            path: '{parent}/profile-edit-avatar',
            props: true,
            component: () => import('./routes/private/edit-avatar'),
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },
        {
            name: 'user:logout',
            parent: 'personal',
            path: '{parent}/logout',
            component: () => import('./routes/private/logout'),
            meta: {
                vroute: {
                    enable: true,
                }
            }
        },

        {
            name: 'user:confirm.email',
            parent: 'personal',
            path: '{parent}/confirm-email/:email?',
            component: () => import('./routes/private/confirm-email'),
            props: true,
            meta: {
                vroute: true
            }
        },
        {
            name: 'user:confirm.phone',
            parent: 'personal',
            path: '{parent}/confirm-phone/:phone?',
            component: () => import('./routes/private/confirm-phone'),
            props: true,
            meta: {
                vroute: true
            }
        },
    ]);
}

export function store(modules) {
    modules.user_pub = require('./store').default;
}

export function scopes(scopes) {
    scopes.user = {
        storeModule: 'user'
    }
    scopes.sess = {
        storeModule: 'user'
    }
}
