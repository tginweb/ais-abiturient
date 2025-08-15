export function userNoticeFetch(context, {filter, elementInclude, options}) {
    return context.dispatch('gql/fetch', {
        query: require('../gql/query/user_single.gql'),
        fetchPolicy: 'no-cache',
        variables: {
            filter: filter,
            elementInclude: elementInclude
        },
        ...options
    }, {root: true})
}

export function userNoticesFetch(context, {filter, elementInclude, options}) {
    return context.dispatch('gql/fetch', {
        query: require('../gql/query/user_list.gql'),
        fetchPolicy: 'no-cache',
        variables: {
            filter: filter,
            elementInclude: elementInclude
        },
        ...options
    }, {root: true})
}

export function userNoticesRead(context, {filter = {}, options = {}}) {
    return context.dispatch('gql/mutation', {
        mutation: require('../gql/mutation/user_list_read.gql'),
        variables: {
            filter: filter
        },
        ...options
    }, {root: true})
}

