export function favIds(state, getters) {
    return state.sess.favItems || []
}

export function favIdsIndexed(state, getters, rootState) {
    return state.sess.favItems.reduce((map, id) => {
        map[id] = id
        return map
    }, {});
}
