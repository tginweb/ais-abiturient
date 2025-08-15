export function boot({Vue}) {
  Vue.component('faq-entity-card', () => import('../component/entity-card'))
  Vue.component('faq-entity-detail', () => import('../component/entity-detail'))
}

export function request({Vue, router}) {

}
