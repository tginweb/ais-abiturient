import app from '../boot/app'

app.addRoutes([
  {
    name: 'admin',
    path: '/admin',
    component: () => import('~module/app/layout/admin'),
    meta: {
      //scopes: ['sess', 'user'],
      //guards: {'user': true}
    },
    children: []
  },
  {
    name: 'pub',
    path: '/',
    components: {
      default: () => import('~module/app/layout/pub'),
    },
    children: []
  }
])

export default app.buildRoutes()


