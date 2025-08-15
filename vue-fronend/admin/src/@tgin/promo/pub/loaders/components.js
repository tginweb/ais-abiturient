export function boot({Vue}) {
  Vue.component('promo-entity-card', () => import('../component/entity-card'))
  Vue.component('promo-entity-detail', () => import('../component/entity-detail'))
}

export function request({Vue, router}) {

}
