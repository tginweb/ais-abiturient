export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    statuses: data.statuses,
    appStatuses: data.appStatuses
  })
}


