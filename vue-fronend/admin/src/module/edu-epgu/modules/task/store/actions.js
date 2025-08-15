export async function entityAddFromTargets(context, {targets, action}) {

  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/task_addFromTargets.gql'),
    variables: {
      targets: targets,
      action: action
    }
  })
  return data.res
}

export async function entityAddFromEntities(context, {action, entityType, id, ids, scope}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/task_addFromEntities.gql'),
    variables: {
      action: action,
      entityType: entityType,
      ids: id ? [id] : ids,
      scope: scope
    }
  })
  return data.res
}


export async function entityFetchDetail(context, id) {
  const {data} = await this.apollo.defaultClient.query({
    query: require('../gql/query/task_single.gql'),
    fetchPolicy: 'no-cache',
    variables: {
      filter: {id: {eq: id}}
    }
  })
  return data.res
}

export function fetchTaskTypes(context, refetch) {
  return new Promise(async (resolve, reject) => {

    if (context.state.app.taskTypes.length) {
      resolve(context.state.app.taskTypes)
      return;
    }

    try {
      const {data} = await this.apollo.defaultClient.query({
        query: require('../gql/query/taskType_list.gql'),
        fetchPolicy: 'no-cache',
        variables: {}
      })
      context.commit('SET_TASK_TYPES', data.res)
      resolve(data.res);
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

export async function fetchTaskType(context, code) {
  const {data} = await this.apollo.defaultClient.query({
    query: require('../gql/query/taskType_single.gql'),
    fetchPolicy: 'no-cache',
    variables: {
      code: code
    }
  })
  return data.res
}


export async function apiEntityAdd(context, model) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/task_add.gql'),
    variables: {
      model: model
    }
  })
  return data.res
}

export async function entityDeleteMultiple(context, {id, ids}) {
  const {data} = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/task_remove.gql'),
    variables: {
      ids: id ? [id] : ids
    }
  })
  return data.res
}
