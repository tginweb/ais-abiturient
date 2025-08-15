<template>

  <q-header class="bg-white text-dark" elevated>
    <q-toolbar style="min-height: 40px;">

      <q-btn
        flat
        dense
        round
        @click="drawerOpened = !drawerOpened"
        aria-label="Menu"
        icon="menu"
        v-if="!drawerOpened"
      />

      <div class="s-font-xl q-mr-xl text-weight-bold">{{ title }}</div>

      <q-space/>

      <div class="q-py-sm q-gutter-x-sm" v-if="menuActions.length">
        <q-btn
          v-for="(item, index) of menuActions"
          :key="index"
          :label="item.label"
          @click="onMenuItemClick(item)"
          outline
          dense
          color="primary"
        />
      </div>

      <q-breadcrumbs v-if="false" style="font-size: 16px">
        <q-breadcrumbs-el label="Home"/>
        <q-breadcrumbs-el label="Заказы"/>
        <q-breadcrumbs-el label="Активные"/>
      </q-breadcrumbs>

    </q-toolbar>
  </q-header>

</template>

<script>

export default {
  props: {
    title: {}
  },
  components: {},
  data() {
    return {}
  },
  computed: {

    menuActions() {
      //return this.$store.getters['menu/currentActions'](this.$route.path)
      return []
    },

    drawerOpened: {
      get: function () {
        return this.$store.state.cab.drawerOpened
      },
      set: function (val) {
        this.$store.commit('cab/SET_DRAWER_OPENED', val)
      }
    },
  },
  methods: {
    onMenuItemClick(item) {
      try {
        this.$router.push({path: item.url, query: {vroute: true}}, ()=>{}, ()=>{} )
      } catch (e) {

      }
    }
  }
}
</script>

<style lang="scss">


</style>
