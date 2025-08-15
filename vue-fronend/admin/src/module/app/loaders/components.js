
export function boot({Vue}) {
  Vue.mixin(require('@tgin/main/common/mixin/common').default);

  Vue.component('el-print-template', require('@project/components/elements/print-template').default)

  Vue.component('el-tpl-checkbox', require('@project/components/elements/tpl-checkbox').default)

}

export function request({Vue, router}) {

}
