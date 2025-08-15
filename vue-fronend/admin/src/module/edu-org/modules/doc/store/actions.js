export async function action(context, args) {
    const {data} = await this.apollo.defaultClient.mutate({
        mutation: require('../gql/mutation/action.gql'),
        variables: {
            ...args
        }
    })
    return data.res
}
