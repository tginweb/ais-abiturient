export default function () {
  return {

    app: {
      orderStatuses: [],
      orderPropGroups: [],
      orderProps: [],
      personTypes: [],
      defaultLocations: [],
      deliveryZones: [],
      deliveryZonesFetched: false,

      deliveryServices: [],
      paysystems: [],
      departments: [],
    },

    scopes: {
      order: {
        fetched: false,
      }
    },

  }
}
