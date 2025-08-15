const loaders = [
  require('./loaders/components'),
  require('./loaders/icons'),
]

if (!process.env.SERVER) {
  Array.prototype.push.apply(loaders, [
    require('../core/loaders/vue-social-sharing'),
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


