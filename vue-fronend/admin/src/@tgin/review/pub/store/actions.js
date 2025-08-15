export function userReviewFetch(context, {filter = {}, id, elementId, options = {}}) {
    if (id)
        filter.ID = {eq: id}

    if (elementId)
        filter.ELEMENT_ID = {eq: elementId}

    return context.dispatch('gql/fetch', {
        query: require('../gql/query/user_single.gql'),
        variables: {
            filter: filter
        },
        ...options
    }, {root: true})
}

export function userReviewsFetch(context, {filter, options}) {
    return context.dispatch('gql/fetch', {
        query: require('../gql/query/user_list.gql'),
        fetchPolicy: 'no-cache',
        variables: {
            filter: filter,
        },
        ...options
    }, {root: true})
}

