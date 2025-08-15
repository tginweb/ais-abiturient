<template>

  <q-layout
    view="hHh lpR fFf"
    class="bg-grey-1"
  >

    <q-page-container>

      <router-view />

    </q-page-container>

  </q-layout>

</template>

<script>


export default {
  components: {

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
