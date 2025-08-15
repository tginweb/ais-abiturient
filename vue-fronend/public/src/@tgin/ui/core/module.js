const loaders = [
  require('./loaders/components'),
  require('./loaders/icons'),
  require('./loaders/vue-html-to-paper'),
]

if (!process.env.SERVER) {
  Array.prototype.push.apply(loaders, [
    require('./loaders/vue-scroll-behavior'),
    require('./loaders/vue-hc-sticky'),
  ])
}

export function boot(ctx) {
  loaders.forEach((loader) => {
    loader.boot(ctx);
  })
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}


