export function byId(state) {
  return state.app.items.reduce((map, obj) => (map[obj.id] = obj, map), {})
}

export function items(state) {
  return state.app.items
}

export function options(state, getters) {
  return getters.items
}

export function optionsActive(state, getters) {
  return getters.items.filter(item => item.active)
}
