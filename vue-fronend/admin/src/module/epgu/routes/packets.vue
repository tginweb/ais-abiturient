<template>
  <q-page class="">

    <layout-cab-page-header
      title=""
    />

    <div>

      <q-btn
        :to="{path: '/order/view/99999', query: {vroute: true}}"
      >
        sss
      </q-btn>

    </div>

  </q-page>
</template>

<script>

import CRoute from "~module/app/component/route";

export default {
  extends: CRoute,
  components: {},
  apollo: {},
  data() {
    return {
      page: {
        title: 'Каталог'
      },
      orderId: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.orderId = to.params.order
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.orderId = to.params.order
    next();
  },
  methods: {

    vrouteOnEntityEvent(event, entity, params) {

      console.log('onEntityEvent!!!!')
      console.log([event, entity, params])
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
