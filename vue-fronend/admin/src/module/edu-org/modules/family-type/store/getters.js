export function byId(state) {
  return state.app.items.reduce((map, obj) => (map[obj.nid] = obj, map), {})
}

export function items(state) {
  return state.app.items
}
