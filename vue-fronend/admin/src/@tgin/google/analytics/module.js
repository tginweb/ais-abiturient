import VueGtag from "vue-gtag";

export function routerInit({Vue, router, isClientProduction}) {
  if (!isClientProduction)
    return;

  Vue.use(VueGtag, {
    config: {
      id: this.options.id
    },

  }, router)
}


