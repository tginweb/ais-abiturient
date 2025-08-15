import Vue from "vue";

export function SET_TASK_TYPES(state, data) {
  Vue.set(state.app, 'taskTypes', data)
}
