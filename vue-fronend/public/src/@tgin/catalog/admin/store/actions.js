export function productFetch(context, {id, iblock, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('../gql/product/query/single.gql'),
        variables: {
            iblock: iblock,
            filter: {
                ID: {eq: id},
            },
        },
        ...options
    }, {root: true})
}
