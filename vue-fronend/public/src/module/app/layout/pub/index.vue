<template>

  <q-layout
    view="hHh lpR fFf"
    class="bg-grey-1"
  >

    <CHeader :leftDrawerOpen.sync="leftDrawerOpen">

      <template v-slot:right>

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

        <div style="height:90vh;" class="column">

          <c-drawer-nav/>

          <div class="q-mt-auto q-px-sm s-font-2xs text-center" style="">
            <a target="_blank" class="text-grey-4" style="text-decoration: underline;" href="https://hse.enjoysurvey.com/ru/survey/2344/index/m_09f90c8dd100af6d8c76f984da0b07fc">Мониторинг экономики образования 2022. Всероссийский опрос абитуриентов вузов</a>
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
import CDrawerNav from './inc/drawer-nav'


export default {
  components: {
    CHeader,
    CHeaderUserMenu,
    CDrawerNav
  },
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  computed: {
    drawerWidth() {
      let res = 230;
      if (this.$q.screen.gt.sm && this.$q.screen.lt.lg) {
        res = 170
      }
      return res;
    }
  }
}
</script>

<style lang="sass" scoped>


</style>
