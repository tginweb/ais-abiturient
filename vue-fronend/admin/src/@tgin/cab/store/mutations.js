export function STATE_INIT(state, data) {
  if (data.cabinets) {
    state.cabinets = data.cabinets

    data.cabinets.forEach(item => {
      if (item.CURRENT) {
        state.current = item.CODE
      }
    })
  }
}

export function SET_CURRENT(state, code) {
  state.current = code
}

export function SET_DRAWER_OPENED(state, val) {
  state.drawerOpened = val
}
