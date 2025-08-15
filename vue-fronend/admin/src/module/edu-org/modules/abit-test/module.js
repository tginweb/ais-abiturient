const loaders = []

export function boot({Vue}) {

}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.edu_test = require('./store').default
}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':
      //query = query.add(require('./gql/order/query/scope/app.gql'), {})
      break
  }

  return query
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {

      parent: 'admin',
      path: '{parent}/edu/test/admin/:viewId',
      component: () => import('./routes/list-admin'),
      props: true
    },
    {
      parent: 'admin',
      path: '{parent}/edu/app/:entityId/view',
      component: () => import('./routes/view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

  ]);

}
