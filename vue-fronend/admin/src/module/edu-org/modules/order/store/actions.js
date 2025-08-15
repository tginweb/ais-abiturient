export async function entityQuerySingle(context, id) {
    const {data} = await this.apollo.defaultClient.query({
        query: require('../gql/order/query/single.gql'),
        fetchPolicy: 'no-cache',
        variables: {
            filter: {[typeof id === 'string' ? '_id' : 'nid']: {eq: id}}
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
    } else {
        throw new Error('Mutation not found')
    }
}

function apiMutationMap(name) {
    switch (name) {
        case 'epguAction':
            return require('../gql/order/mutation/epguAction.gql')

        case 'action':
            return require('../gql/order/mutation/action.gql')
        case 'addApp':
            return require('../gql/order/mutation/appAdd.gql')

        case 'changeDecree':
            return require('../gql/order/mutation/changeDecree.gql')
        case 'changeInstitute':
            return require('../gql/order/mutation/changeInstitute.gql')
        case 'changeOperator':
            return require('../gql/order/mutation/changeOperator.gql')

        case 'fisEgePacketImport':
            return require('../gql/order/mutation/fisEgePacketImport.gql')
        case 'operatorTake':
            return require('../gql/order/mutation/operatorTake.gql')
        case 'setAgreementChangedProcessed':
            return require('../gql/order/mutation/setAgreementChangedProcessed.gql')

        case 'setAisPorted':
            return require('../gql/order/mutation/setAisPorted.gql')
        case 'setAisToPort':
            return require('../gql/order/mutation/setAisToPort.gql')

        case 'setStatus':
            return require('../gql/order/mutation/setStatus.gql')
    }
}
