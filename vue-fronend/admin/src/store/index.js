import Vue from 'vue'
import Vuex from 'vuex'
import modIndex from '@tgin/main/store/root/index'
import app from '../boot/app'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {

  const Store = new Vuex.Store({
    strict: process.env.DEV,
    modules: app.getStoreModules(),
    ...modIndex,
  })

  return Store
}
