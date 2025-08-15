export function listQuerySingle(context, id) {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await this.apollo.defaultClient.query({
        query: require('../gql/list/query/single.gql'),
        fetchPolicy: 'no-cache',
        variables: {
          filter: {
            id: {eq: id}
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


export async function createSnapshot(context) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/snap/mutation/create.gql'),
    variables: {
    }
  })
  return data.res
}


export async function listActionMultiple(context, {action, id, ids, params}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/list/mutation/actionMultiple.gql'),
    variables: {
      action: action,
      ids: id ? [id] : ids,
      params: params
    }
  })
  return data.res
}

