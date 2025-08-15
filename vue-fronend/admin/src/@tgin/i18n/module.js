const loaders = [

]

export function boot(ctx) {
  loaders.forEach((loader) => {
    loader.boot(ctx);
  })
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {

  modules.i18n = require('./store').default
}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':
      query = query.add(require('./gql/scope/app.gql'), {})
      break
  }

  return query
}
