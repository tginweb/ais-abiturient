import * as VueWindow from '@hscmap/vue-window'

const loaders = [

]

export function boot({Vue}) {

  Vue.use(VueWindow)

  Vue.component('window-desktop', require('./component/vroutes').default);

  loaders.forEach((loader) => {
    loader.boot(ctx);
  })
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.window = require('./store').default
}

