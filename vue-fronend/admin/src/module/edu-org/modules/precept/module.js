const loaders = []

export function boot({Vue}) {

}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.edu_precept = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'admin',
      path: '{parent}/edu-epgu/precept/list',
      component: () => import('./routes/items-list'),
    },
    {
      path: '{parent}/edu-epgu/precept/:entityId/view',
      component: () => import('./routes/item-view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
          is: 'edu-precept-view',
        }
      }
    },
  ])

}
