export function orderFetch(context, {id, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('@tgin/sale/admin/gql/order/query/single.gql'),
        variables: {
            filter: {
                ID: {eq: id},
            },
        },
        ...options
    }, {root: true})
}

export function vorderFetch(context, {id, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('@tgin/sale/admin/gql/vorder/query/single.gql'),
        variables: {
            filter: {
                ID: {eq: id},
            },
        },
        ...options
    }, {root: true})
}

export function profileFetch(context, {id, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('@tgin/sale/admin/gql/profile/query/single.gql'),
        variables: {
            filter: {
                ID: {eq: id},
            },
        },
        ...options
    }, {root: true})
}

export function paycardFetch(context, {id, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('@tgin/sale/admin/gql/paycard/query/single.gql'),
        variables: {
            filter: {
                ID: {eq: id},
            },
        },
        ...options
    }, {root: true})
}

export function paycardPaymentFetch(context, {id, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('@tgin/sale/admin/gql/paycard-payment/query/single.gql'),
        variables: {
            filter: {
                ID: {eq: id},
            },
        },
        ...options
    }, {root: true})
}

export function vorderAction(context, {id, ids, action, options = {}}) {
    return context.dispatch('gql/mutation', {
        mutation: ids ? require('../gql/vorder/mutation/multiple.gql') : require('../gql/vorder/mutation/single.gql'),
        variables: {
            id: id,
            ids: ids,
            action: action,
        },
        ...options
    }, {root: true})
}
