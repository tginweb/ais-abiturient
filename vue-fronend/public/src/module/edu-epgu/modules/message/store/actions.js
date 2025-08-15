

export async function entityQuerySingle(context, {id}) {
  const {data} = await this.apollo.defaultClient.query({
    query: require('../gql/query/single.gql'),
    fetchPolicy: 'no-cache',
    variables: {
      filter: {id: {eq: id}}
    }
  })
  return data.res
}

export async function apiMutate(context, ctx) {
  const mutation = apiMutationMap(ctx.mutation)
  if (mutation) {
    return this.apollo.defaultClient.mutate({
      mutation: mutation,
      variables: ctx
    })
  }
}

function apiMutationMap(name) {
  switch (name) {
    case 'action': return require('../gql/mutation/action.gql')
    case 'createFromEntity': return require('../gql/mutation/createFromEntity.gql')
    case 'createFromEntities': return require('../gql/mutation/createFromEntities.gql')
    case 'importQueue': return require('../gql/mutation/importQueue.gql')
    case 'save': return require('../gql/mutation/save.gql')
  }
}
