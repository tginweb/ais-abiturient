<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    :title="pageTitle"
    @hide="onHide"
  >
    <div class="">Все товары будут удалены из корзины. Действие невозможно отменить.</div>

  </component>

</template>

<script>
import MRoute from "@tgin/main/router/mixin/route-public";
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MRoute, MVRoute],
  components: {},
  props: {
    onSuccess: {}
  },
  data() {
    return {
      comment: null
    }
  },
  computed: {
    pageTitle() {
      return 'Очистить корзину'
    },
    actions() {
      return [
        {
          label: 'Очистить',
          color: 'primary',
          callback: () => {
            this.$store.dispatch('sale_pub/basketOp', ['clear'])
            this.visible = false
          }
        },
      ]
    }
  },
  methods: {}
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
