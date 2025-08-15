export async function syncWithAdmissions(context, {ids}) {
  console.log(ids)
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/syncWithAdmissions.gql'),
    variables: {
      ids: ids
    }
  })
  return data.res
}

export async function entityDeleteMultiple({dispatch}, ctx) {
  return dispatch('entityActionMultiple', {...ctx, action: 'delete'})
}

export async function entityActionMultiple(context, {action, ids, params}) {
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

export async function entityAction(context, {action, id, params}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/action.gql'),
    variables: {
      action: action,
      id: id,
      params: params
    }
  })
  return data.res
}

