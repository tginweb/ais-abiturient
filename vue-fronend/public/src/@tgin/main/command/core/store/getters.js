export function commandsByCode(state, getters) {
    return state.app.commands.reduce((map, item) => {
        map[item.code] = item
        return map
    }, {})
}

