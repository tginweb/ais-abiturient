const loaders = [
  require('./loaders/config'),
  require('./loaders/icons'),
  require('./loaders/components'),
]


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

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'pub',
      path: '',
      components: {
        default: require('./routes/front').default,
      }
    },
    {
      parent: 'admin',
      path: '/admin/dashboard',
      components: {
        default: require('./routes/dashboard').default,
      }
    },
  ])
}


export function store(modules) {
  modules.app = require('./store/index').default;
}

export function scopes(scopes) {
  scopes.app = {
    storeModule: 'app'
  }
}
