<template>

  <component
      v-bind="bindRouterWrapper"
      :path="pagePathFull"
      :title="pageTitle"
      @hide="onHide"
  >
    <div class="q-px-md q-px-lg-none q-mt-md q-mt-lg-none">

      <div class="q-mb-md">
        Для оформления заказов от имени юридических лиц используйте профили компаний:
      </div>

      <CList
          ref="view"
          v-model="defaultProfileId"
          :items="$store.state.sale_pub.user.buyerCompanies"
      />
    </div>
  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'
import CList from "../../../component/order/buyer-company/list.page";

export default {
  mixins: [MRoute, MVRoute],
  components: {
    CList
  },
  props: {

  },
  data() {
    return {
      page: {
        title: 'Юридические лица',
      },
    }
  },
  computed: {
    defaultProfileId: {
      get: function () {
        return this.$store.getters['sale_pub/userDefaultCompanyId']
      },
      set: async function (val) {
        this.$store.dispatch('sale_pub/userOrderCompanySetDefault', val)
      }
    },
    actions() {
      const result = [];
      result.push({
        label: 'Добавить компанию',
        icon: this.$icons.fasPlus,
        color: this.vrouterIsPage ? '' : 'primary',
        callback: () => {
          this.$refs.view.onCreate()
        }
      })
      return result
    },
  },
  methods: {},
}
</script>
<style lang="scss" scoped>

.c-orders {
  border: 1px solid #EFEEEE;

  .c-orders__order:not(:last-child) {
    border-bottom: 1px solid #EFEEEE;
  }
}

</style>
