<template>
  <q-page class="q-mt-lg q-mb-xl">

    {{$store.getters['user/cabinetUrl']}} --

  </q-page>
</template>

<script>
import CRoute from "~app/component/route";

export default {
  extends: CRoute,
  components: {},
  data() {
    return {
      page: {
        title: 'Каталог'
      },
    }
  },

  created() {

    if (this.$store.getters['user/cabinetUrl']) {
      this.$router.replace(this.$store.getters['user/cabinetUrl'])
    }

  }
}
</script>
<style lang="scss" scoped>

.items {
   /deep/.i-wrap {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
}

</style>
