<template>
  <div class="com" ref="com">
---
    <q-tabs
        v-model="tab"
        dense
        class="c-tabs q-px-sm q-py-sm"
        active-color="primary"
        align="left"
        narrow-indicator
        no-caps
        v-if="$store.getters['user/authorized'] || true"
    >
      <q-tab name="fav" label="Избранное" class="q-px-sm"/>
      <q-tab name="orders" label="Заказы" class="q-px-sm"/>
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="">

      <q-tab-panel name="fav" class="q-px-none q-py-none">

        <template v-if="!isFavsAndSalesEmpty">
          <q-scroll-area
              :style="{
                height: scrollHeight + 'px'
            }"
          >
            <div ref="items">

              <q-resize-observer @resize="onResize"/>

              <template v-if="queries.favs.result && !queries.favs.state.isLoading">
                <template v-if="queries.favs.result.nodes.length">
                  <catalog-product-element-mini
                      :item="item"
                      :key="item.ID"
                      v-for="item in queries.favs.result.nodes"
                      class=" q-py-md q-pl-md q-pr-md"
                  />
                </template>
              </template>
              <div v-else class="text-center q-pa-md">
                <ui-progress-spinner/>
              </div>

              <div class="q-mt-sm" v-if="queries.sales.result && queries.sales.result.nodes.length">

                <div class="s-font-md q-mb-sm text-weight-bold text-center q-py-sm bg-primary-brown-gray-1">
                  Часто заказываете
                </div>

                <catalog-product-element-mini
                    :item="item"
                    :key="item.ID"
                    v-for="item in queries.sales.result.nodes"
                    class=" q-py-md q-px-md"
                />

              </div>

            </div>

          </q-scroll-area>

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
        </template>
        <div v-else class="q-pa-md text-center">
          избранные товары не выбраны
        </div>

      </q-tab-panel>

      <q-tab-panel name="orders" class="q-px-none q-py-none" v-if="$store.getters['user/authorized'] || true">

        <q-scroll-area
            :style="{
                height: scrollHeight + 'px'
              }"
        >
          <div ref="items" v-if="queries.orders.result">

            <div
                class="row q-py-md q-px-md"
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

        <ui-progress-inner-loading
            :value="true"
            v-if="queries.orders.state.isLoading"
        />

      </q-tab-panel>

    </q-tab-panels>


  </div>
</template>

<script>

import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  apollo: {
    favs: generateQueryInfo('favs', require('@tgin/catalog/core/gql/product/query/productElements.gql'), {fetchPolicy1: 'cache'}),
    sales: generateQueryInfo('sales', require('@tgin/catalog/core/gql/product/query/productElements.gql'), {fetchPolicy1: 'cache'}),
    orders: generateQueryInfo('orders', require('@tgin/sale/pub/gql/order/query/list.gql'), {fetchPolicy1: 'cache'})
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
              IN_USER_BESTSELLERS: true,
            }
          },
          state: {
            isLoading: false,
            skip: !this.$store.getters['user/authorized']
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
            skip: false//!this.$store.getters['user/authorized']
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
    isFavsAndSalesEmpty() {
      if (this.queries.favs.state.isLoading || this.queries.sales.state.isLoading) {
        return false
      }
      return (!this.queries.favs.result || !this.queries.favs.result.nodes.length) && (!this.queries.sales.result || !this.queries.sales.result.nodes.length)
    }
  },
  methods: {
    onResize() {

      if (this.$refs.items) {

        const rect = this.$refs.com.getBoundingClientRect()

        const itemsTop = parseInt(rect.y)
        const itemsHeight = this.$refs.items.clientHeight
        const bottomHeight = this.$refs.bottom.clientHeight

        const topHeight = this.$refs.com.clientHeight
        const windowHeight = window.innerHeight

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
