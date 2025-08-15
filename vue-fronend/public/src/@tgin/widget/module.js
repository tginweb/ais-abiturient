
const loaders = [

]

export function boot({Vue}) {
  //Vue.use(VueSmartWidget)

  Vue.component('widget-layout', require('./component/layout').default);

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
  modules.widget = require('./store').default
}

