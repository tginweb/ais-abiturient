export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    statuses: data.statuses,
    appStatuses: data.appStatuses,
    eduTypes: data.eduTypes,
  })
}

export function SCOPE_USER(state, data) {
  Object.assign(state.user, {
    order: data.order,
  })
}

export function SET_ORDER(state, data) {
  state.user.order = data
}

export function SET_ORDER_DATA(state, data) {
  Object.assign(state.user.order, data)
}

export function SET_ORDER_AVAILABLE_ADMISSIONS(state, data) {
  Object.assign(state.user.orderAvailableAdmissions, data)
}


export function PAGE_STEP(state, step) {
  state.pageStep = step
}


