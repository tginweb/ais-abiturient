export function userFetch(context, {id, options = {}}) {
  return context.dispatch('gql/fetch', {
    query: require('../gql/user/query/single.gql'),
    variables: {
      filter: {
        ID: {eq: id},
      },
    },
    ...options
  }, {root: true})
}
