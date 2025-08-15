<template>

  <q-header elevated class="bg-white text-grey-8 q-py-lg-sm" height-hint="64">

    <q-toolbar class="c-toolbar">

      <q-btn
        flat
        dense
        round
        @click="leftDrawerOpenData = !leftDrawerOpenData"
        aria-label="Menu"
        icon="menu"
        class=""
      />

      <CBrand :title="title"></CBrand>

      <q-space />

      <slot name="right"></slot>

    </q-toolbar>

  </q-header>

</template>

<script>

import CBrand from './parts/brand'

export default {
  components: {
    CBrand
  },
  props: {
    title: {},
    leftDrawerOpen: {}
  },
  data() {
    return {
      leftDrawerOpenData: this.leftDrawerOpen
    }
  },
  watch: {
    leftDrawerOpen(val) {
      this.leftDrawerOpenData = val
    },
    leftDrawerOpenData(val) {
      this.$emit('update:leftDrawerOpen', val)
    }
  }
}
</script>

<style lang="scss" scoped>




</style>
