export function userOrder(state) {
    return state.user.order
}

export function userOrderDocs(state, getters) {
    return getters.userOrder && getters.userOrder.docs || []
}

export function userOrderDocByRole(state, getters) {
    return getters.userOrderDocs.reduce((map, doc)=>{
        if (!map[doc.type]) {
            map[doc.type] = doc
        } else if (doc.isMain) {
            map[doc.type] = doc
        }
        return map
    }, {})
}

export function userOrderAvailableAdmissions(state, getters) {
    return state.user.orderAvailableAdmissions
}

export function userOrderStepsById(state, getters) {
    return getters.userOrder && getters.userOrder.stepsInfo.reduce((map, obj) => (map[obj.code] = obj, map), {});
}

export function statusById(state) {
    return state.app.statuses.reduce((map, obj) => (map[obj.id] = obj, map), {})
}

export function statusOptions(state) {
    return state.app.statuses.map(status => ({
        ...status,
        disable: !status.selectable
    }))
}

export function appStatusOptions(state) {
    return state.app.appStatuses.map(status => ({
        ...status,
        disable: !status.selectable
    }))
}



