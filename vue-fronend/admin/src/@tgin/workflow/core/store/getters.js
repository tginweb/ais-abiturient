
export function orderStatusesO(state) {
  return state.app.orderStatuses.filter(status => status.TYPE === 'O')
}
