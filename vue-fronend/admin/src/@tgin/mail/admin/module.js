
export function store(modules) {
  modules.mail_admin = require('./store').default
}

export function routes(routes) {

  routes.push({
    name: 'mail:events',
    parent: 'admin',
    path: '{parent}/mail/events/:viewId?',
    component: () => import('./routes/events'),
    props: true,
    meta: {
      vroute: {
        enable: false,
      }
    }
  })

  routes.push({
    name: 'mail:event',
    parent: 'admin',
    path: '{parent}/mail/event/:entityId',
    component: () => import('./routes/event'),
    props: true,
    meta: {
      vroute: {
        enable: true,
      }
    }
  })
}
