export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    commands: data.commands,
  })
}

