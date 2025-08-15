export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    types: data.types,
    statuses: data.statuses,
  })
}
