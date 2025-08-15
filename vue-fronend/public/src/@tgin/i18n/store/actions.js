import Cookies from 'js-cookie'

export async function setLanguage(context, code) {

  if (context.rootGetters['user/loggedIn']) {

  }

  Cookies.set('lang', code)

  let lang = context.getters.languagesByCode[code]

  context.commit('setLanguage', code)

  import(`quasar/lang/${lang.quasar}`).then(({default: messages}) => {
    this.$q.lang.set(messages)
  })

}
