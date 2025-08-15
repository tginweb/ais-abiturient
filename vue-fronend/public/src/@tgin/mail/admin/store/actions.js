export function eventAction(context, {id, ids, action, options = {}}) {
    return context.dispatch('gql/mutation', {
        mutation: ids ? require('../gql/event/mutation/multiple.gql') : require('../gql/event/mutation/single.gql'),
        variables: {
            id: id,
            ids: ids,
            action: action,
        },
        ...options
    }, {root: true})
}
