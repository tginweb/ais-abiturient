import vueScrollBehavior from '../packages/vue-scroll-behavior/vue-scroll-behavior'

export function boot({Vue}) {

}

export function request({Vue, router, store}) {
  Vue.use(vueScrollBehavior, {
    router: router,
    bus: Vue.bus,
    el: '#q-app-fake',
    maxLength: 100,
    delay: 1200
  })
}
