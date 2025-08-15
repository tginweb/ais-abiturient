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
  modules.edu_institute = require('./store').default
}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':
      query = query.add(require('./gql/query/scope/app.gql'), {})
      break
  }

  return query
}


export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'admin',
      path: '{parent}/edu/institute/list',
      component: () => import('./routes/items-list'),
    },
  ]);

}
