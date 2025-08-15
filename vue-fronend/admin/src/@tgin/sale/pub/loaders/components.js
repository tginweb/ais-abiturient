
export function boot({Vue}) {

  Vue.component('sale-basket-item-quantity', require('@tgin/sale/pub/component/basket/item/quantity').default);

  Vue.component('entity-sale-order-detail', () => import('../component/order/order/entity/detail'))
  Vue.component('entity-sale-order-teaser', () => import('../component/order/order/entity/teaser'))
  Vue.component('entity-sale-order-row', () => import('../component/order/order/entity/row'))
  Vue.component('entity-sale-order-dialog', () => import('../component/order/order/entity/dialog'))

  Vue.component('sale-basket-item-quantity', require('../component/basket/item/quantity').default)

  Vue.component('sale-vorder-paysystem-change-to-cash', () => import('../component/order/vorder/inc/paysystem-change-to-cash'))

  Vue.component('sale-form-group-field', () => import('../component/form-group-field'))

}

export function request({Vue, router}) {

}
