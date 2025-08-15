<template>
  <q-page class="q-mt-lg q-mb-xl">

    <div class="container q-mb-md">
      <el-page-header :title="pageTitle"/>
    </div>

    <div class="container">

      <entity-sale-order-detail
        :entityId="orderId"
        :entityHash="orderHash"
      />

    </div>

  </q-page>
</template>

<script>
import MRoute from "@tgin/main/router/mixin/route-public";

export default {
  name: 'page.order',
  mixins: [MRoute],
  components: {

  },
  data() {
    return {
      page: {},
      order: null,
    }
  },
  computed: {
    orderId() {
      return parseInt(this.$route.query.id)
    },
    orderHash() {
      return this.$route.query.hash
    },
    pageTitle() {
      return 'Ваш заказ принят'
    },
  },
}
</script>
<style lang="scss" scoped>

.items {
  /deep/ .i-wrap {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
}

</style>
