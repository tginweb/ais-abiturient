import * as propComponents from '@tgin/sale/core/component/order/prop/field'

export function boot({Vue}) {

  for (const [name, com] of Object.entries(propComponents)) {
    Vue.component(name, com);
  }
}

export function request({Vue, router}) {

}
