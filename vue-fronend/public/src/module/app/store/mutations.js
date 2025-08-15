
export function updatePage(state, data) {
  Object.assign(state.page, data)
}

export function setContextLoaded(state) {
  state.contextLoaded = true
}

export function setOption(state, [name, value]) {
  state.options[name] = value
}

export function setSiteMode(state, data) {
  state.siteMode = data
}

export function setSession(state, data) {
  state.session = data
}

export function STATE_INIT(state, data) {
  if (data.session) {
    state.session = data.session
  }
}
