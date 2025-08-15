export function all(state, getters) {
  return  state.app.settings.reduce((map, item) => {
    map[item.KEY] = item.VALUE
    return map
  }, {});
}

export function key(state, getters) {
  return  state.app.settings.reduce((map, item) => {
    map[item.KEY] = item.VALUE
    return map
  }, {});
}
