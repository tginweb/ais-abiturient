export function userFetch(context, {id, options = {}}) {
  return context.dispatch('gql/fetch', {
    query: require('../gql/query/single.gql'),
    variables: {
      filter: {
        ID: {eq: id},
      },
    },
    ...options
  }, {root: true})
}

export async function apiMutate(context, ctx) {
  const mutation = apiMutationMap(ctx.mutation)
  if (mutation) {
    return this.apollo.defaultClient.mutate({
      mutation: mutation,
      variables: ctx
    })
  } else {
    throw new Error('Mutation not found')
  }
}

function apiMutationMap(name) {
  switch (name) {
    case 'action': return require('../gql/mutation/action.gql')
  }
}
