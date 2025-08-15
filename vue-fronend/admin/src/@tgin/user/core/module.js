const loaders = [

]

export function boot(ctx) {
  loaders.forEach((loader) => {
    loader.boot(ctx);
  })
}

export function store(modules) {
  modules.user = require('./store').default;
}

export function scopes(scopes) {
  scopes.user = {
    storeModule: 'user'
  }
  scopes.sess = {
    storeModule: 'user'
  }
}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':

      break
    case 'user':
      query = query.add(require('./gql/scope/user.gql'), {})
      break
  }

  return query
}

export async function guardAccess(result, {to, guardName, guardParams, store}) {

  switch (guardName) {
    case 'user':
      if (!store.getters['user/authorized']) {

        if (to.params.guardShowAlert) {

          store.dispatch('user/showNeedAuthAlert', {})

          return false
        } else {
          return {
            redirect: {
              path: this.$app.getRouteByName('user:auth', 'path')
            }
          }
        }
      }
      break
  }
  return result
}
