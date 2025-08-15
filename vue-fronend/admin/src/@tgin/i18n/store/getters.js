
export function languages(state, getters, rootState) {
  return [
    {
      title: 'English',
      titleShort: 'Eng',
      code: 'en',
      quasar: 'en-us',
      icon: '/statics/lang/gb.svg'
    },
    {
      title: 'Русский',
      titleShort: 'Рус',
      code: 'ru',
      quasar: 'ru',
      icon: '/statics/lang/ru.svg'
    },
  ];
}

export function languagesByCode(state, getters, rootState) {
  return getters.languages.reduce((map, obj) => (map[obj.code] = obj, map), {});
}

export function currentLang(state, getters, rootState) {
  return getters.languagesByCode[state.lang]
}

export function currentLangCode(state, getters, rootState) {
  return getters.currentLang.code
}

export function translates(state, getters, rootState) {
  return state.translates[state.lang] || {}
}

export function translatesNamespaced(state, getters, rootState) {

  let res = {};
  let translates = getters.translates;

  for (let key in translates) {

    let [ns, phrase] = key.split('.')

    if (!res[ns]) res[ns] = {}

    res[ns][phrase] = translates[key]
  }

  return res
}



