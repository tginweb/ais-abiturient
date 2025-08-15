

export function store(modules) {
  modules.menu = require('./store').default
}

export function scopeQuery(query, name, t) {

  switch (name) {
    case 'app':
      query = query.add(require('./gql/scope/app.gql'), {})
      break
  }

  return query
}
