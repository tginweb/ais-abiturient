export function byId(state) {
  return state.app.items.reduce((map, obj) => (map[obj.id] = obj, map), {})
}

export function egeItems(state) {
  return state.app.items.filter(item => item.isege === 't')
}

export function egeItemsOptions(state, getters) {
  return getters.egeItems
}
