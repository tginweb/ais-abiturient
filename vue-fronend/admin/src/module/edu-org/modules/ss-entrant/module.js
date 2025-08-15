const loaders = [

]

export function boot({Vue}) {

}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.edu_ss_entrant = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [

    {
      parent: 'admin',
      path: '{parent}/edu-epgu/ss-entrant/list',
      component: () => import('./routes/items-list'),
    },
    {
      parent: 'admin',
      path: '{parent}/edu-epgu/ss-entrant/:entityId/view',
      component: () => import('./routes/item-view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
  ])

}
