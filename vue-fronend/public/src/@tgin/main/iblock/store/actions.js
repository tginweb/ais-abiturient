export async function apiElementSetActive(context, {id, iblockId, active}) {
  const data = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/admin_iblock_element_set_active.gql'),
    variables: {
      elementId: id,
      iblockId: iblockId,
      active: active
    }
  })
  return data
}

export async function apiElementDelete(context, {id, iblockId}) {
  const data = await this.apollo.defaultClient.mutate({
    mutation: require('../gql/mutation/admin_iblock_element_delete.gql'),
    variables: {
      elementId: id,
      iblockId: iblockId,
    }
  })
  return data
}
