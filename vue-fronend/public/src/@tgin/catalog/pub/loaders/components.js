export function boot({Vue}) {

  Vue.component('catalog-product-element-card', () => import('../component/entity/product-element-card'));
  Vue.component('catalog-product-element-detail', () => import('../component/entity/product-element-detail'));
  Vue.component('catalog-product-element-search', () => import('../component/entity/product-element-search'));
  Vue.component('catalog-product-element-mini', () => import('../component/entity/product-element-mini'));

  Vue.component('catalog-constructor-product', () => import('../component/constructor/product'));
}

export function request({Vue, router}) {

}
