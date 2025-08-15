export function SCOPE_APP(state, data) {
  Object.assign(state.app, {
    personTypes: data.personTypes,
    orderStatuses: data.orderStatuses,
    orderPropGroups: data.orderPropGroups,
    orderProps: data.orderProps,
    defaultLocations: data.defaultLocations,

    paysystems: data.paysystems,
    deliveryServices: data.deliveryServices,
    departments: data.departments,
  })
}

export function SET_DELIVERY_ZONES(state, data) {
  state.app.deliveryZonesFetched = true
  state.app.deliveryZones = data
}
