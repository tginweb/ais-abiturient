export function boot({Vue}) {

  Vue.mixin(require('../mixin/screen').default);

}

export function request({Vue, router}) {

}
