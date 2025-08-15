export function boot({Vue}) {
  Vue.component('post-entity-card', () => import('../component/entity-card'))
  Vue.component('post-entity-detail', () => import('../component/entity-detail'))
}

export function request({Vue, router}) {

}
