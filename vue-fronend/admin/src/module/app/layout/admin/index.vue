<template>

  <c-layout
    :app-title="$config.get('APP.TITLE')"
    :menu-left="menuItems"
    @logout="$store.dispatch('router/nav', {name: 'logout'})"
  >

    <div>
      <router-view/>
    </div>
  </c-layout>

</template>

<script>

import CLayout from '@tgin/ui/admin/layout/cab/cab'

export default {
  components: {
    CLayout
  },
  data() {
    return {
      menuSelected: null,
      ss: null,
      miniState: false,
      miniToOverlay: true,
      drawerHover: false,
      treeExpanded: []
    }
  },
  created() {

  },

  computed: {

    menuItems() {
      return this.$util.base.treeFilter(
        this.$store.getters['menu/menusItems']['admin'] || [], (item, level) => {
          if (!item.icon) delete item.icon
          return true
        }
      )
    },
  },
  watch: {

  },
  methods: {



  }
}
</script>

<style lang="sass" scoped>


</style>
