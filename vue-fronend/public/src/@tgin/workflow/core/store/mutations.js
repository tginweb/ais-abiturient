export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    paysystems: data.paysystems,
    orderStatuses: data.orderStatuses,
  })
}
