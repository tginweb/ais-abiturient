export function SCOPE_APP(state, data) {
  if (data.app_scope)
    state.app.settings = data.app_scope
}

