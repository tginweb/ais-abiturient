
export function boot({Vue, inject}) {

}

export function request({Vue, inject, router, store}) {
  inject('$routerNav', (data) => {
    return store.dispatch('router/nav', data)
  })
}
