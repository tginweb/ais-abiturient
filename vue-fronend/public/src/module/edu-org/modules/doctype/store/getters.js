export function byId(state) {
  return state.app.items.reduce((map, obj) => (map[obj.id] = obj, map), {})
}

export function options(state) {
  return state.app.items
}
