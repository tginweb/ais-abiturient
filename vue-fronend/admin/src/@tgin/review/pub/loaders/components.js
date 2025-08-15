export function boot({Vue}) {
  Vue.component('review-entity-product', require('../component/entity/product-review').default)
  Vue.component('review-entity-social', require('../component/entity/social-review').default)

  Vue.component('review-entity-user', () => import('../component/entity/user-review'))
}

export function request({Vue, router}) {

}
