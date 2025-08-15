<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :path="pagePathFull"
      :title="pageTitle"
      @hide="onHide"
  >

    <template v-slot:default v-if="entity">

      <div class="q-mb-md">
        Дата заказа: {{ entity.DATE_FORMATTED }}
      </div>

      <div class="c-basket__table q-mb-md">
        <div
            v-for="basketItem of entity.BASKET"
            :key="basketItem.ID"
            class="c-basket__item q-py-sm border-b-md-1 border-primary-brown-1"
        >
          <div class="row q-col-gutter-md">

            <div class="col-4">

              <img
                  v-if="basketItem.ELEMENT && basketItem.ELEMENT.LIST_IMAGE"
                  :src="$image.resolveUrl(basketItem.ELEMENT.LIST_IMAGE.SRC, 'r100')"
              />

            </div>

            <div class="col-15">
              <div>{{ basketItem.NAME }}</div>
              <div class="text-primary-brown-gray-4">

                {{ basketItem.QUANTITY }}

                <span v-if="basketItem.ELEMENT">{{ basketItem.ELEMENT.MEASURE.NAME }}</span>

              </div>
            </div>

            <div class="col-5 text-right">
              <nobr>{{ $util.format.price(basketItem.FINAL_PRICE_BASE, true) }}</nobr>
            </div>

          </div>
        </div>
      </div>

      <div>
        Позиции заказа будут добавлены в корзину. Повторить заказ?
      </div>

    </template>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MRoute, MVRoute],
  components: {},
  props: {},
  data() {
    return {
      comment: null
    }
  },
  computed: {
    pageTitle() {
      return 'Повтор заказа ' + (this.entity ? '№' + this.entity.ACCOUNT_NUMBER : '')
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
          URL: '/profile/order/' + this.entityId + '/repeat',
          NAME: 'Повтор'
        }
      ]
      return path
    },
    actions() {
      return [
        {
          label: 'Повторить',
          color: 'primary',
          callback: this.onSubmit
        }
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      try {
        this.entity = await this.$store.dispatch('sale_pub/userOrderFetch', {
          id: this.entityIdState,
          hash: this.entityHash,
          options: {
            state: this.requestState,
          }
        })
      } catch (e) {

      }
    },

    async onSubmit() {

      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/order/mutation/repeat.gql'),
          variables: {
            id: this.entityIdState,
          },
          state: this.requestState
        })
        this.onResolve && this.onResolve()
        await this.$store.dispatch('sale_pub/basketFetch', {params: {recalc: true}})
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
