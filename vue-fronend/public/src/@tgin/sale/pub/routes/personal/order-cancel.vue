<template>

  <component
      v-bind="bindRouterWrapper"
      :path="pagePathFull"
      :title="pageTitle"
      @hide="onHide"
  >

    <div class="q-mb-md ">Уверены что хотите отменить заказ?</div>

    <q-input
        v-model="comment"
        outlined
        label="Вы можете указать причину отмены"
        rows="2"
        type="textarea"
        maxlength="2000"
    />

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

import CProfiles from "../../component/order/profile/list.page";

export default {
  name: 'page.profile',
  mixins: [MRoute, MVRoute],
  components: {
    CProfiles
  },
  props: {
  },
  data() {
    return {
      comment: null
    }
  },
  computed: {
    pageTitle() {
      return 'Отмена заказа №' + this.entityId
    },
    pagePath() {
      const path = [
        {
          URL: '/profile/orders/',
          NAME: 'Заказы'
        },
        {
          URL: '/profile/order/' + this.entityId,
          NAME: 'Заказ ' + this.entityId
        },
        {
          URL: '/profile/order/' + this.entityId + '/cancel',
          NAME: 'Отмена'
        }
      ]
      return path
    },
    actions() {
      return [
        {
          label: 'Отменить заказ',
          callback: this.onSubmit,
          loading: this.requestState.mutating
        }
      ]
    }
  },
  methods: {
    async onSubmit() {

      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('@tgin/sale/pub/gql/order/mutation/cancel.gql'),
          variables: {
            id: this.entityId,
            comment: this.comment
          },
          state: this.requestState
        })

        if (this.onResolve)
          this.onResolve(this.entityIdState)

        this.visible = false
      } catch (e) {
        console.log(e)
      }
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
