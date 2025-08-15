export function fetchSingle(context, {id, withApps}) {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await this.apollo.defaultClient.query({
        query: require('../gql/query/single.gql'),
        fetchPolicy: 'no-cache',
        variables: {
          withApps: withApps,
          filter: {
            _id: {eq: id}
          }
        }
      })
      resolve(data.res);
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}


export function recalcPlaces(context, ids) {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await this.apollo.defaultClient.mutate({
        mutation: require('../gql/mutation/recalc_places.gql'),
        fetchPolicy: 'no-cache',
        variables: {

        }
      })
      resolve(data.res);
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}




