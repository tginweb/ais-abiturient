export async function entityQuery(context, {id}) {
  const {data} = await this.apollo.defaultClient.query({
    query: require('../gql/query/single.gql'),
    fetchPolicy: 'no-cache',
    variables: {
      filter: {
        id: {eq: id}
      }
    }
  })
  return data.res
}

export async function entityUpdateMultiple({dispatch}, ctx) {
  return dispatch('entityActionMultiple', {...ctx, action: 'update'})
}

export async function entityActionMultiple(context, {action, ids, models, params}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/actionMultiple.gql'),
    variables: {
      action: action,
      ids: ids,
      models: models,
      params: params
    }
  })
  return data.res
}

export async function entityAction(context, {action, id, model, params}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/action.gql'),
    variables: {
      action: action,
      id: id,
      model: model,
      params: params
    }
  })
  return data.res
}
