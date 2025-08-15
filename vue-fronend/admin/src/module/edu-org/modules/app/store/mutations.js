export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    statusList: data.statusList,
    cancelReasons: data.cancelReasons
  })
}


