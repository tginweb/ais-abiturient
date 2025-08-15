import app from '../../boot/app'

export function scopeFetched(state, getters) {
  return (scope) => {
    const scopeInfo = app.getScopeInfo(scope)
    if (scopeInfo) {
      const module = scopeInfo.storeModule
      if (module) {
        return state[module].scopes[scope].fetched
      }
    }
  }
}

export function scopeAccess(state, getters) {
  return async (result, scope, store) => {
    await app.scopeAccess(result, scope, store)
  }
}

export function guardAccess(state, getters) {
  return async (result, guardName, guardParams, store) => {
    await app.guardAccess(result, guardName, guardParams, store)
  }
}
