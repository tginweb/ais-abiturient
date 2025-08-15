

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

}
