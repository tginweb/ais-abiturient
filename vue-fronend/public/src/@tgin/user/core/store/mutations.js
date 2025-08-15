import Vue from "vue";
import Cookies from 'js-cookie'


function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function USER(state, data) {
  Vue.set(state.user, 'user', data)
}

export function AVATAR(state, data) {
  if (state.user.user) {
    Vue.set(state.user.user, 'AVATAR', data)
  }
}

export function TOKEN(state, data) {
  state.user.token = data
  Cookies.set('token', data)
  console.log(parseJwt(data))
  console.log(data)
}

export function TOKEN_DELETE(state) {
  state.token = ''
  Cookies.set('token', '')
}

export function SCOPE_APP(state, data) {
  if (data.avatarElements)
    state.app.avatarElements = data.avatarElements
}

export function SCOPE_SESS(state, data) {

}

export function SCOPE_USER(state, data) {
  if (data.user)
    state.user.user = data.user
}

export function PROP(state, {code, value}) {
  state.user.user.PROPS.forEach(item => {
    if (item.CODE === code)
      item.VAL = value
  })
}
