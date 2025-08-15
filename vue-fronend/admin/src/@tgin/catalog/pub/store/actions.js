
export function productElementQuery(context, {filter, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('../../core/gql/product/query/productElement.gql'),
        fetchPolicy: 'no-cache',
        variables: {
            filter: filter
        },
        ...options
    }, {root: true})
}

export async function favOp(context, [op, params]) {

    let query, vars = {};

    vars = {
        ...params
    }

    switch (op) {
        case 'add':
            query = require('../../core/gql/product/mutation/fav_add.gql')
            context.commit('FAV_ITEM_ADD', params.productId);
            break;
        case 'remove':
            query = require('../../core/gql/product/mutation/fav_remove.gql')
            break;
        case 'clear':
            query = require('../../core/gql/product/mutation/fav_clear.gql')
            context.commit('ITEMS_CLEAR');
            break;
    }

    try {

        const data = await context.dispatch('gql/mutation', {
            mutation: query,
            variables: vars
        }, {root: true})

        if (data) {
            context.commit('FAV_ITEMS_UPDATE', data)
        }

    } catch (e) {
        console.log(e)
    }

}
