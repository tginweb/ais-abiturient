import Cookies from 'js-cookie'


export default {
  lang:  Cookies.get('lang') || 'ru',
  translates: {},

}
