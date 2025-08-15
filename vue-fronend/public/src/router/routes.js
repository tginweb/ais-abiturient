import app from '../boot/app'

app.addRoutes([
  {
    name: 'cab',
    path: '/cab',
    component: () => import('~module/app/layout/cab'),
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

const routes = app.buildRoutes()

console.log(routes)
export default routes


