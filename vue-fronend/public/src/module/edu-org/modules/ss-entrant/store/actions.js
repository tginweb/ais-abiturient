export function querySingle(context, id) {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await this.apollo.defaultClient.query({
        query: require('../gql/query/single.gql'),
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


export async function attachEntrantDocs(context, {id, docIds}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/attachEntrantDocs.gql'),
    fetchPolicy: 'no-cache',
    variables: {
      id: id,
      docIds: docIds
    }
  })
  return data.res
}


export async function entityActionMultiple(context, {action, ids, params}) {

  console.log('entityActionMultiple')
  console.log({action, ids})

  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/actionMultiple.gql'),
    variables: {
      action: action,
      ids: ids,
      params: params
    }
  })
  return data.res
}
