<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :title="pageTitle"
      @hide="onHide"
  >

    <template v-slot:default>

      fff

    </template>

  </component>

</template>

<script>
import MRoute from "@tgin/main/router/mixin/route-public";
import MVRoute from '@tgin/main/router/mixin/vroute'
import CBasket from "../component/basket/basket";

export default {
  mixins: [MRoute, MVRoute],
  extends: CBasket,
  props: {
    onSuccess: {}
  },
  data() {
    return {
      comment: null,
      showingVesTooltip: false,
      summaryIntersect: false,
      vorderRefetch: true,
      isMounted: false,
    }
  },
  async mounted() {
    await this.fetch()
    this.isMounted = true
  },
  computed: {
    pageTitle() {
      return 'Корзина'
    },
    actions() {
      return [
        {
          label: 'Оформить',
          color: 'primary',
          callback: () => {
            this.visible = false
            this.$router.push('/order')
          }
        },
      ]
    }
  },
  methods: {
    onNavOrder() {
      if (ym)
        ym(8821120, 'reachGoal', 'Oform');

      this.$router.push('/order')
    }
  }
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
