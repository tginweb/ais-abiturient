export async function actionMultiple(context, {action, id, ids, params}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/actionMultiple.gql'),
    variables: {
      action: action,
      ids: id ? [id] : ids,
      params: params
    }
  })
  return data.res
}

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
