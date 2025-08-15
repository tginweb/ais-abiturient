const loaders = []

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

export function routes(routes, routesByRole) {

  Array.prototype.push.apply(routes, [
    {
      path: '/cab/seller',
      component: () => import('~module/cab/layout/cab/index'),
      meta: {
        scopes: ['sess', 'user']
      },
      children: [
        {
          path: '/cab/seller/dashboard',
          component: () => import('./routes/dashboard'),
        },
        {
          path: '/cab/seller/orders/active/:order?',
          component: () => import('./routes/orders-active'),
        },


      ]
    },
  ]);

}
