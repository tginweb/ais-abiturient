<template>
  <q-page class="q-mt-lg q-mb-xl">

    <div class="container">
      <el-page-header :path="breadcrumbs" :title="pageTitle"/>
    </div>

    <CBasket/>

    <div class="container">
      <q-no-ssr>
        <chunk-products-viewed
            class="q-mt-xl"
        />
      </q-no-ssr>
    </div>

  </q-page>
</template>

<script>
import CBasket from "../component/basket/basket.page";
import MRoute from "@tgin/main/router/mixin/route-public";

export default {
  mixins: [MRoute],
  components: {
    CBasket
  },
  props: {
  },
  apollo: {},
  data() {
    return {
      page: {
        title: 'Корзина'
      },
      queries: {
        basket: {
          vars: {
            elementInclude: true
          },
          state: {
            isLoading: false
          },
          result: null
        },
      },
    }
  },
  computed: {
    pageTitle() {
      return 'В корзине ' + this.$store.getters['sale_pub/basketCount'] + ' товаров'
    },
    breadcrumbs() {
      return [
        {label: 'Корзина', url: '/cart'},
      ]
    }
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
