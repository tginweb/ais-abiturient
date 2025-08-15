export function fetchAdmission(context, id) {
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

export async function entityFill(context, {ids, id}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/fill.gql'),
    variables: {
      ids: ids || [id],
    }
  })
  return data.res
}

export async function entityFillGosline(context, {ids, id}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/fill_gosline.gql'),
    variables: {
      ids: ids || [id],
    }
  })
  return data.res
}


export async function epguExport(context, {ids, id}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/epguExport.gql'),
    variables: {
      ids: ids || [id],
    }
  })
  return data.res
}

export async function ensureAll(context) {
  const {data} = await this.apollo.defaultClient.query({
    query: require('../gql/query/list.gql'),
    fetchPolicy: 'cache',
    variables: {}
  })
  context.commit('SET_ADMISSIONS', data.res)
  return data.res
}



