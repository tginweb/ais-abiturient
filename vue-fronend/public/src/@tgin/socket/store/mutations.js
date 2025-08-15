export function SCOPE_APP (state, data) {
    state.translates = data.translates
}


export function setLanguage (state, data) {
  state.lang = data
  moment.locale(data)
}


