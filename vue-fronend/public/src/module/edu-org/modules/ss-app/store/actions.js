



export async function entityActionMultiple(context, {action, ids, params}) {

    console.log('entityActionMultiple')
    console.log({action, ids})

    const {data} = await this.apollo.defaultClient.mutate({
        mutation: require('../gql/mutation/actionMultiple.gql'),
        variables: {
            action: action,
            ids: ids,
            params: params
        }
    })
    return data.res
}
