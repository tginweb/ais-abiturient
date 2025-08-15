import app from '~src/boot/app'

export function SCOPE_SET_FETCHED(state, scope) {

  const scopeInfo = app.getScopeInfo(scope)

  if (scopeInfo) {
    const scopeModule = scopeInfo.storeModule
    const scopeName = scope

    if (state[scopeModule] && state[scopeModule].scopes[scopeName])
      state[scopeModule].scopes[scopeName].fetched = true
  }
}

export function HTTP_HEADERS(state, data) {
  for (const [field, val] of Object.entries(data)) {
    state.httpHeaders[field] = JSON.stringify(val)
  }
}
