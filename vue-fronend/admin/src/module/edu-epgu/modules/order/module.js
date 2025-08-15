const loaders = [

]

export function boot({Vue}) {

  Vue.component('edu-epgu-order-import-entrants', () => import('./routes/order-import-entrants'))
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store({modules}) {
  modules.edu_epgu_order = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      path: '/cab/edu-epgu/order/import-applications',
      component: () => import('./routes/order-import-entrants'),
      props: true,
      meta: {
        vroute: {
          enable: true,
          is: 'edu-epgu-order-import-entrants',
        }
      }
    },
  ])

}
