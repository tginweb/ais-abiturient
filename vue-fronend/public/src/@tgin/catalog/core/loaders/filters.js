export function boot({Vue}) {

  Vue.filter('price', function (value) {
    return Math.round(parseFloat(value)) + ' ₽'
  })
}

export function request({Vue, router}) {

}
