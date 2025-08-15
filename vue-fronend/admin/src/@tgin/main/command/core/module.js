const loaders = []

export function boot(ctx) {

}

export async function request({inject, store}) {
  inject('$command', (data) => {
    return store.dispatch('command/run', data)
  })
}

export function store(modules) {
  modules.command = require('./store').default
}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':
     // query = query.add(require('./gql/scope/app.gql'), {})
      break
  }

  return query
}
