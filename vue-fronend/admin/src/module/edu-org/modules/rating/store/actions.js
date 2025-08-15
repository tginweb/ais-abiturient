export function fetchSingle(context, id) {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await this.apollo.defaultClient.query({
        query: require('../gql/query/single.gql'),
        fetchPolicy: 'no-cache',
        variables: {
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

export async function actionMultiple(context, args) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/actionMultiple.gql'),
    variables: args
  })
  return data.res
}

export async function create(context) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/create.gql'),
  })
  return data.res
}

export async function makeActual(context, args) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/makeActual.gql'),
    variables: args
  })
  return data.res
}
