const loaders = [

]

if (process.env.SERVER) {
  Array.prototype.push.apply(loaders, [
    require('./loaders/memory'),
  ]);
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

