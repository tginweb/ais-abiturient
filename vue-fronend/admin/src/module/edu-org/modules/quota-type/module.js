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
  modules.edu_quotaType = require('./store').default
}

export function scopeQuery(query, name) {
  switch (name) {
    case 'app':
      query = query.add(require('./gql/query/scope/app.gql'), {})
      break
  }
  return query
}


