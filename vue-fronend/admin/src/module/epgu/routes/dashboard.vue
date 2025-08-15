<template>
  <q-page class="">

    <layout-cab-page-header
      title="Рабочее место"
    />


  </q-page>
</template>

<script>

import CRoute from "~module/app/component/route";
import CList from "~module/sale-admin/component/entity/order/list/list";

export default {
  extends: CRoute,
  components: {
    CList
  },
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
}
</script>
<style lang="scss" scoped>


</style>
