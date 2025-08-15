const loaders = [

]

export function boot({Vue}) {

  Vue.component('messenger-chat-admin', require('./component/chat-admin').default);
  Vue.component('messenger-chat-public', require('./component/chat-public').default);

}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.messenger = require('./store').default
}


export function routesCab(routes) {


}
