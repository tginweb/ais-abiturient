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
  modules.edu_competition = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      name: 'edu.competition:zachisl',
      parent: 'admin',
      path: '{parent}/edu/competition/zachisl',
      component: () => import('./routes/zachisl'),
    },
    {
      name: 'edu.competition:list',
      parent: 'admin',
      path: '{parent}/edu/competition/list',
      component: () => import('./routes/list'),
    },
    {
      parent: 'admin',
      path: '{parent}/edu/competition/:entityId/view',
      component: () => import('./routes/view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

    {
      name: 'edu.competition:list.fac',
      parent: 'admin',
      path: '{parent}/edu/competition/fac/:viewId',
      component: () => import('./routes/list-fac'),
      props: true
    },

  ]);

}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':
      query = query.add(require('./gql/scope/app.gql'), {})
      break
  }

  return query
}
