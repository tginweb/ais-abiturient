import YmapPlugin from 'vue-yandex-maps'

export function boot({Vue}) {
  Vue.use(YmapPlugin, {
    ...this.options,
    lang: 'ru_RU',
    coordorder: 'longlat',
    version: '2.1'
  })
}

