import Vue from "vue";

export function assignDictionary(state, data) {
    Vue.set(state.dictionary, data.name, data.value)
}

