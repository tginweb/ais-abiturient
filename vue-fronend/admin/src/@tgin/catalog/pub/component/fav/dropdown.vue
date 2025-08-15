<template>
  <div class="com" ref="com">

    <q-tabs
        v-model="tab"
        dense
        class="c-tabs q-px-sm"
        active-color="primary"
        align="left"
        narrow-indicator
        no-caps
        ref="top"
    >
      <q-tab name="fav" label="Избранное" class="q-px-sm"/>
      <q-tab name="orders" label="Заказы" class="q-px-sm"/>
    </q-tabs>

    <q-tab-panels v-model="tab" animated>

      <q-tab-panel name="fav" class="q-pr-sm">

        <q-scroll-area
            :style="{
                height: scrollHeight + 'px'
              }"
        >
          <div ref="items" v-if="queries.favs.result">

            <q-resize-observer @resize="onResize"/>

            <div>
              <div class="s-font-lg q-mb-sm" v-if="false">
                В избранном
              </div>

              <catalog-product-element-mini
                  :item="item"
                  :key="item.ID"
                  v-for="item in queries.favs.result.nodes"
                  class=" q-py-md q-pr-md"
              />
            </div>

            <div class="q-mt-sm">

              <div class="s-font-md q-mb-sm text-weight-bold text-center q-py-sm bg-primary-brown-gray-1">
                Часто заказываете
              </div>

              <catalog-product-element-mini
                  :item="item"
                  :key="item.ID"
                  v-for="item in queries.favs.result.nodes"
                  class=" q-py-md q-pr-md"
              />

            </div>


          </div>

        </q-scroll-area>

      </q-tab-panel>

      <q-tab-panel name="orders">

        <q-scroll-area
            :style="{
                height: scrollHeight + 'px'
              }"
        >
          <div ref="items" v-if="queries.orders.result">
            <div
                class="row q-py-md"
                :key="order.ID"
                v-for="order in queries.orders.result.nodes"
                v-if="order.PRICE > 0"
            >
              <div class="col-24 col-sm-grow">
                <div class="s-font-2xs text-primary-brown-gray-4">{{ order.DATE_FORMATTED }}</div>
                <div class="text-weight-bold q-my-none">Заказ №{{ order.ACCOUNT_NUMBER }} на
                  {{ $util.format.price(order.PRICE) }}
                </div>
              </div>
              <div class="col-24 col-sm-auto text-right" :class="{'text-right': $q.screen.gt.sm}">

                <q-btn
                    label="повторить"
                    dense
                    color="primary"
                    outline
                    size="15px"
                    :to="{
                    name: 'sale:order.repeat',
                    params: {
                      entityId: order.ID
                    }
                  }"
                />

              </div>
            </div>
          </div>
        </q-scroll-area>

      </q-tab-panel>

    </q-tab-panels>

    <div ref="bottom" class="q-pb-md q-pt-sm q-mx-md q-gutter-sm text-center">

      <q-btn
          color="primary"
          class="full-width"
          label="все избранное"
          outline
          size="14px"
          to="/favorites/"
      />

    </div>

  </div>
</template>

<script>

import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  apollo: {
    favs: generateQueryInfo('favs', require('../../../core/gql/product/query/productElements.gql'), {fetchPolicy: 'cache'}),
    sales: generateQueryInfo('sales', require('../../../core/gql/product/query/productElements.gql'), {fetchPolicy: 'cache'}),
    orders: generateQueryInfo('orders', require('@tgin/sale/pub/gql/order/query/list.gql'), {fetchPolicy: 'cache'})
  },
  data() {
    return {
      scrollHeight: 100,
      tab: 'fav',
      queries: {
        favs: {
          vars: {
            filter: {
              IN_FAVORITES: true,
            }
          },
          state: {
            isLoading: false,
            skip: false
          },
          result: null
        },
        sales: {
          vars: {
            filter: {
              //IN_SALES: true,
            }
          },
          state: {
            isLoading: false,
            skip: false
          },
          result: null
        },
        orders: {
          vars: {
            filter: {},
            nav: {
              limit: 5
            }
          },
          state: {
            isLoading: false,
            skip: false
          },
          result: null
        },
      },
    }
  },
  computed: {
    onResizeDebounced() {
      return this.$util.base.debounce(this.onResize, 100)
    },
  },
  methods: {
    onResize() {

      if (this.$refs.items) {

        const rect = this.$refs.com.getBoundingClientRect()

        const itemsTop = parseInt(rect.y)
        const itemsHeight = this.$refs.items.clientHeight
        const bottomHeight = this.$refs.bottom.clientHeight
        const topHeight = this.$refs.top.$el.clientHeight
        const windowHeight = window.innerHeight

        console.log([windowHeight, itemsTop, bottomHeight, topHeight])

        const maxHeight = windowHeight - itemsTop - bottomHeight - topHeight - 50;

        let height = itemsHeight > maxHeight ? maxHeight : itemsHeight

        this.scrollHeight = height
      }
    }
  },
  watch: {
    tab() {
      this.onResizeDebounced()
    },
    '$q.screen.height'(v) {
      this.onResizeDebounced()
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.onResizeDebounced()
      }, 10)
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
