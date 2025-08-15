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
        case 'save': return require('../gql/tag/mutation/save.gql')
    }
}
