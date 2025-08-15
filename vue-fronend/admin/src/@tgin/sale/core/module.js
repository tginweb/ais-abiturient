const loaders = [
  require('./loaders/components'),
]

export function boot(ctx) {
  loaders.forEach((loader) => {
    loader.boot(ctx);
  })
}

export function scopes(scopes) {
  scopes.order = {
    storeModule: 'sale'
  }
}

export function store(modules) {
  modules.sale = require('./store').default
}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':
      query = query.add(require('./gql/scope/app.gql'), {})
      break
  }

  return query
}
