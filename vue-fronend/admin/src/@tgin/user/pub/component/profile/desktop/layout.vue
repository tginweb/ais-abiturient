<template>
  <q-page class="full-height1">

    <div class="container bg-fill full-height1">

      <div class=" q-pb-xl">

        <router-view/>

      </div>

    </div>

  </q-page>
</template>

<script>

import CCard from '../shared/card'

export default {
  name: 'page.profile',
  components: {
    CCard
  },
  props: {},
  data() {
    return {}
  },
  computed: {
    menu() {
      return this.$store.getters['menu/menusItems']['personal'] || []
    }
  }
}

</script>

<style lang="scss" scoped>



</style>
