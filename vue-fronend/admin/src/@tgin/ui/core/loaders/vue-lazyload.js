import VueLazyload from 'vue-lazyload'

export function boot({Vue}) {

  Vue.use(VueLazyload, {
    preLoad1: 1.3,
    error1: 'dist/error.png',
    loading1: 'dist/loading.gif',
    attempt: 1
  })
}

export function request(ctx) {

}

