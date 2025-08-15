export function typeById(state) {
    return state.app.types.reduce((map, obj) => (map[obj.id] = obj, map), {})
}

export function types(state) {
    return state.app.items
}

export function typesByUserOrder(state, getters, rootState, rootGetters) {
    return rootGetters['edu_order/userOrder'] ? state.app.types.filter(item => item.fields.eduType === rootGetters['edu_order/userOrder'].eduType) : []
}

export function typesByEduType(state, getters, rootState, rootGetters) {
    return state.app.types.reduce((map, obj) => {
        if (!map[obj.fields.eduType]) {
            map[obj.fields.eduType] = []
        }
        map[obj.fields.eduType].push(obj)
        return map
    }, {})
}

