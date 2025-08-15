export function deliveryZones(state, getters, rootState) {
    return state.app.deliveryZones
}

export function deliveryZonesForYandexMap(state, getters, rootState) {
    return getters['deliveryZonesToYandexMap'](state.app.deliveryZones)
}

export function deliveryZonesToYandexMap(state, getters, rootState) {
    return (zones) => {
        return zones.map(item => ({
            ...item,
            coords: item.PROP_GEOJSON ? [item.PROP_GEOJSON.geometry.coordinates[0].map((coord) => ([coord[0], coord[1]]))] : null
        }))
    }
}

export function orderStatusesOrder(state, getters, rootState) {
    return state.app.orderStatuses.filter(status => status.TYPE === 'O')
}

export function orderStatusesDelivery(state, getters, rootState) {
    return state.app.orderStatuses.filter(status => status.TYPE === 'D')
}

export function orderProps(state, getters, rootState) {
    return state.app.orderProps
}

export function orderPropsById(state, getters, rootState) {
    return state.app.orderProps.reduce((map, item) => {
        map[item.PROP_ID] = item
        return map
    }, {});
}

export function orderPropsByPersonType(state, getters, rootState) {
    return state.app.orderProps.reduce((map, item) => {
        if (!map[item.PERSON_TYPE_ID])
            map[item.PERSON_TYPE_ID] = []

        map[item.PERSON_TYPE_ID].push(item)
        return map
    }, {});
}

export function orderPropGroups(state, getters, rootState) {
    return state.app.orderPropGroups
}

export function orderPropGroupsById(state, getters, rootState) {
    return state.app.orderPropGroups.reduce((map, item) => {
        map[item.ID] = item
        return map
    }, {});
}

export function personTypesById(state, getters, rootState) {
    return state.app.personTypes.reduce((map, item) => {
        map[item.ID] = item
        return map
    }, {});
}

export function paysystemsById(state, getters, rootState) {
    return state.app.paysystems.reduce((map, item) => {
        map[item.ID] = item
        return map
    }, {});
}

export function deliveryServicesById(state, getters, rootState) {
    return state.app.deliveryServices.reduce((map, item) => {
        map[item.ID] = item
        return map
    }, {});
}

