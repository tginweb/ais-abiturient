export function byId(state) {
    return state.app.types.reduce((map, obj) => (map[obj.id] = obj, map), {})
}

export function items(state) {
    return state.app.types
}

export function itemsByUserOrder(state, getters, rootState, rootGetters) {
    return rootGetters['edu_order/userOrder'] ? state.app.types.filter(item => item.fields.eduType === rootGetters['edu_order/userOrder'].eduType) : []
}

export function itemsByEduType(state, getters, rootState, rootGetters) {
    return state.app.types.reduce((map, obj) => {
        if (!map[obj.fields.eduType]) {
            map[obj.fields.eduType] = []
        }
        map[obj.fields.eduType].push(obj)
        return map
    }, {})
}

