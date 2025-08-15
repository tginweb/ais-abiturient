<template>

  <q-layout
    view="hHh lpR fFf"
    class="bg-grey-1"
  >

    <CHeader :leftDrawerOpen.sync="leftDrawerOpen">

      <template v-slot:right>

        <CUserMenu/>

      </template>

    </CHeader>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="text-white"
      dark
      :width="drawerWidth"
      content-style="background:#3F4A59;"
    >
      <q-scroll-area class="fit">

        <div style="height:90vh;" class="column no-wrap">

          <CDrawerNavOrder/>

          <div class="q-mt-auto text-center">

            <q-list class="c-steps __list text-grey-8" padding separator dark>
              <q-item
                  class="__item"
                  clickable
                  v-ripple
                  v-for="(item, index) of $store.state.app.pubMenuShort"
                  :key="index"
                  :href="item.to"
                  target="_blank"
                  tag="a"
                  dark
              >
                <q-item-section >{{item.label}}</q-item-section>
              </q-item>
            </q-list>

            <div class="q-mt-md q-px-sm s-font-2xs " style="">
              <a target="_blank" class="text-grey-4" style="text-decoration: underline;" href="https://hse.enjoysurvey.com/ru/survey/2344/index/m_09f90c8dd100af6d8c76f984da0b07fc">Мониторинг экономики образования 2022. Всероссийский опрос абитуриентов вузов</a>
            </div>

          </div>

        </div>

      </q-scroll-area>

    </q-drawer>

    <q-page-container>


      <router-view />

    </q-page-container>

  </q-layout>

</template>

<script>

import CHeader from '../.shared/header/header'
import CHeaderUserMenu from '../.shared/header/parts/user-menu'
import CUserMenu from './inc/user-menu'
import CDrawerNavOrder from './inc/drawer-nav-order'

export default {
  components: {
    CHeader,
    CHeaderUserMenu,
    CUserMenu,
    CDrawerNavOrder
  },
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  computed: {
    drawerWidth() {
      let res = 250;

      return res;
    }
  }
}
</script>

<style lang="sass" scoped>


</style>
