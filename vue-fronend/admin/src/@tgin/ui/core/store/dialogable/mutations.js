import Vue from 'vue';

export function dialogStateSet(state, [name, data]) {
  Vue.set(state.dialog[name], 'state', data)
}

export function dialogStateaAssign(state, [name, data]) {
  state.dialog[name].state = {
    ...state.dialog[name].data,
    ...data
  }
}

export function dialogPropsSet(state, [name, data]) {
  Vue.set(state.dialog[name], 'props', data)
}

export function dialogPropsAssign(state, [name, data]) {
  state.dialog[name].props = {
    ...state.dialog[name].props,
    ...data
  }
}

export function dialogShow(state, name) {
  state.dialog[name].value = true;
}

export function dialogHide(state, name) {
  state.dialog[name].value = false;
}

