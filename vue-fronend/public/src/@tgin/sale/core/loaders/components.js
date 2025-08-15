import * as propComponents from './../component/order/prop/field'

export function boot({Vue}) {


  for (const [name, com] of Object.entries(propComponents)) {
    Vue.component(name, com);
  }
}

