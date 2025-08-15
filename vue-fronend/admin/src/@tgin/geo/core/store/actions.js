export function findObject(context, {type, address, lat, lng}) {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await this.apollo.defaultClient.query({
        query: require('../gql/query/geo_geocoder.gql'),
        fetchPolicy: 'no-cache',
        variables: {
          type: type,
          address: address,
          lat: lat,
          lng: lng,
        }
      })
      if (data.res.payload && data.res.payload.objects) {

        let result = {}

        if (data.res.payload.objects.length) {

          const obj = data.res.payload.objects[0]

          if (obj.Point) {
            const [lat, lng] = obj.Point.pos.split(' ')
            result.coordinates = {
              lat: parseFloat(lat),
              lng: parseFloat(lng),
            }
          }

          result.kind = obj.metaDataProperty.GeocoderMetaData.kind
          result.address = obj.metaDataProperty.GeocoderMetaData.text
          result.address = result.address.replace('Россия, ', '')
        }

        resolve(result)

      } else {
        reject()
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}
