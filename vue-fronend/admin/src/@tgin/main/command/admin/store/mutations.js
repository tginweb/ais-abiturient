export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    menus: data.menus,
  })
}

