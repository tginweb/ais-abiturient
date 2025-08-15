export async function apiMutate(context, ctx) {
    const mutation = apiMutationMap(ctx.mutation)
    if (mutation) {
        return this.apollo.defaultClient.mutate({
            mutation: mutation,
            variables: ctx
        })
    }
}

function apiMutationMap(name) {
    switch (name) {
        case 'sync':
            return require('../gql/mutation/sync.gql')
    }
}

export async function ensureDictionary(context, name) {

    console.log(name)

    if (!context.state.dictionary[name]) {
        try {
            const {data: {res}} = await this.apollo.defaultClient.query({
                query: require('../gql/query/list.gql'),
                variables: {
                    filter: {taxonomy: {eq: name}}
                }
            })

            context.commit('assignDictionary', {
                name: name,
                value: res
            })

        } catch (e) {
            console.log(e)
        }
    }

    return context.state.dictionary[name]
}
