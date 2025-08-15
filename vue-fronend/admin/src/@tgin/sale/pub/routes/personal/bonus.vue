<template>

  <component
      v-bind="bindRouterWrapper"
      :path="pagePathFull"
      :title="pageTitle"
      @hide="onHide"
  >
    <div class="q-px-md q-px-lg-none q-mt-md q-mt-lg-none">


      <div class="row items-center q-py-md c-row">
        <div class="col-md-5 s-font-3xl text-weight-bold">
          Мои бонусы:
        </div>
        <div class="col-md-10">
          <q-chip color="primary" rsounded size="lg" text-color="white">
            30
          </q-chip>
        </div>
      </div>

      <div class="row items-center q-py-md c-row">
        <div class="col-md-5 s-font-3xl text-weight-bold">
          Бонусный ранг:
        </div>
        <div class="col-md-10">
          <q-chip color="primary" rsounded size="lg" text-color="white">
            30
          </q-chip>
        </div>
      </div>


    </div>
  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'
import CProfiles from "../../component/order/profile/list.page";

export default {
  mixins: [MRoute, MVRoute],
  components: {
    CProfiles
  },
  props: {},
  data() {
    return {
      page: {
        title: 'Бонусная система',
      },
    }
  },
  computed: {
    defaultProfileId: {
      get: function () {
        return this.$store.getters['sale_pub/userOrderProfileId']
      },
      set: async function (val) {
        this.$store.dispatch('sale_pub/userOrderProfileSetDefault', val)
      }
    },

    actions() {

      const result = [];

      return result
    },
  },
  methods: {}
}
</script>
<style lang="scss" scoped>

.c-row {
  border-bottom: 3px dashed #eee;
}

</style>
