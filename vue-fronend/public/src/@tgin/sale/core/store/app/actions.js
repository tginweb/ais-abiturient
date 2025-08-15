
export function ensureDeliveryZones(context) {
  return new Promise(async (resolve, reject) => {
    if (!context.state.app.deliveryZonesFetched) {
      try {
        const {data} = await this.apollo.defaultClient.mutate({
          mutation: require('@tgin/sale/core/gql/delivery/query/delivery_zone_elements.gql'),
          variables: {}
        })
        context.commit('SET_DELIVERY_ZONES', data.res.nodes)
        resolve();
      } catch (e) {
        console.log(e)
        reject(e)
      }
    } else {
      console.log('deliveryZonesFetched')
      resolve();
    }
  })
}

export async function findDeliveryZone(context, zoneId) {
  await context.dispatch('ensureDeliveryZones')
  return context.state.app.deliveryZones.find(item => item.ID === zoneId || item.CODE === zoneId)
}

