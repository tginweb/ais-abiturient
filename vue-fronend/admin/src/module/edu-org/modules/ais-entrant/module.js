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
  modules.edu_ais_entrant = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'admin',
      path: '{parent}/ais/entrant/list',
      component: () => import('./routes/items-list'),
    },
    {
      parent: 'admin',
      path: '{parent}/ais/entrant/:entityId/view',
      component: () => import('./routes/item'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
  ])

}
