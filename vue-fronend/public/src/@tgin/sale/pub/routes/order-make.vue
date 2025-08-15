<template>
  <q-page class="q-mt-lg q-mb-md">

    <div class="container">
      <el-page-header title="Заказ"/>
    </div>

    <CView
        v-if="loaded"
    />

  </q-page>
</template>

<script>
import CView from "@tgin/sale/pub/component/order/vorder/make.page";
import MRoute from "@tgin/main/router/mixin/route-public";

export default {
  name: 'page.order',
  mixins: [MRoute],
  components: {
    CView
  },
  props: {},
  data() {
    return {
      loaded: false
    }
  },
  async mounted() {

    this.$store.dispatch('router/setPageData', {
      title: 'Оформление заказа',
      backlink: {
        url: '/cart',
        title: 'Вернуться в корзину'
      },
      sidecom: null
    })

    await this.$store.dispatch('sale_pub/vorderFetch', {check: true})

    this.loaded = true
  }
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
