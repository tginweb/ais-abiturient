
export async function entityQuerySingle(context, {by = 'nid', id, val}) {
    const {data} = await this.apollo.defaultClient.query({
        query: require('../gql/query/single.gql'),
        fetchPolicy: 'no-cache',
        variables: {
            filter: {[by]: {eq: val || id}}
        }
    })
    return data.res
}
