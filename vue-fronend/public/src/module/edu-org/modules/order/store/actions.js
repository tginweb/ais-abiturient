export async function userOrderEnsureAdmissions(context) {
  try {
    const {data: {res}} = await this.apollo.defaultClient.query({
      query: require('../gql/order/query/available_admissions.gql'),
      fetchPolicy: 'no-cache',
    })
    context.commit('SET_ORDER_AVAILABLE_ADMISSIONS', res)
    return res
  } catch (e) {
    console.log(e)
  }
}


export async function userOrderFetch(context) {
  try {
    const {data: {res}} = await this.apollo.defaultClient.query({
      query: require('../gql/order/query/fetch_by_user.gql'),
      fetchPolicy: 'no-cache',
    })
    context.commit('SET_ORDER', res)
    return res
  } catch (e) {
    console.log(e)
  }
}

export async function userOrderEnsureRequired(context) {
  try {
    const {data: {res}} = await this.apollo.defaultClient.query({
      query: require('../gql/order/mutation/ensure_required.gql'),
      fetchPolicy: 'no-cache',
    })
    context.commit('SET_ORDER', res)
    return res
  } catch (e) {
    console.log(e)
  }
}

export async function userOrderFetchDocs(context) {
  try {
    const {data: {res}} = await this.apollo.defaultClient.query({
      query: require('../gql/order/query/docs.gql'),
      fetchPolicy: 'no-cache',
    })
    context.commit('SET_ORDER_DATA', {'docs': res})
    return res
  } catch (e) {
    console.log(e)
  }
}


export function setPageStep(context, step) {
  context.commit('PAGE_STEP', step)
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
    case 'epguAction': return require('../gql/order/mutation/create.gql')
  }
}

