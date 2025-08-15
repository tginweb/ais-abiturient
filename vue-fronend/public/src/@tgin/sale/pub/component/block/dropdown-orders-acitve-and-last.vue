<template>
  <div class="com" ref="com">

    <q-scroll-area
        :style="{
            height: scrollHeight + 'px'
        }"
    >
      <q-list ref="items" class="c-sections rounded-borders">

        <q-expansion-item
            class="c-section"
            label="Активные заказы"
            header-class="s-font-md q-mb-sm text-weight-bold text-center q-py-sm bg-primary-brown-gray-1"
            v-if="ordersActive.length"
            @after-show="onResize"
            @after-hide="onResize"
            :default-opened="true"
            dense
        >
          <div class="q-pt-md">

            <div
                class="row q-col-gutter-md no-wrap q-mb-lg q-pr-md cursor-pointer"
                :key="order.ID"
                v-for="order in ordersActive"
                v-if="order.PRICE > 0"
                @click="$router.push(order.URL)"
            >

              <div class="col-auto">

                <div class="s-font-2xs text-primary-brown-gray-4">{{ order.DATE_FORMATTED }}</div>

                <div class="text-weight-bold q-my-none">
                  Заказ №{{ order.ACCOUNT_NUMBER }} на {{ $util.format.price(order.PRICE) }}
                </div>

              </div>

              <div class="col-shrink text-right">

                <div class="leading-e5 s-font-sm" :style="{color: order.CSTATUS_COLOR }">
                  {{ order.CSTATUS_NAME }}
                </div>

              </div>

            </div>
          </div>

        </q-expansion-item>

        <q-expansion-item
            class="c-section"
            label="Последние заказы"
            header-class="s-font-md q-mb-sm text-weight-bold text-center q-py-sm bg-primary-brown-gray-1"
            v-if="ordersHistory.length"
            @after-show="onResize"
            @after-hide="onResize"
            :default-opened="!ordersActive.length"
            dense
        >
            <div
                class="row q-py-md q-pr-md"
                :key="order.ID"
                v-for="order in ordersHistory"
                v-if="order.PRICE > 0"
            >
              <div class="col-24 col-sm-grow">
                <div class="s-font-2xs text-primary-brown-gray-4">{{ order.DATE_FORMATTED }}</div>
                <div class="">
                  Заказ №{{ order.ACCOUNT_NUMBER }} на
                  {{ $util.format.price(order.PRICE) }}
                </div>
              </div>
              <div class="col-24 col-sm-auto text-right">

                <q-btn
                    label="повторить"
                    dense
                    color="primary"
                    outline
                    class="--normal"
                    size="15px"
                    :to="{
                      name: 'sale:order.repeat',
                      params: {
                        entityId: order.ID,
                        entityHash: order.ACCESS_HASH
                      }
                    }"
                />

              </div>
            </div>

        </q-expansion-item>

      </q-list>

    </q-scroll-area>

    <div class="q-mt-md" ref="bottom">

      <q-btn
          color="primary"
          class="full-width"
          label="все заказы"
          outline
          size="14px"
          :to="{name: 'sale:orders'}"
      />

    </div>


  </div>
</template>

<script>

import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  apollo: {
    ordersHistory: generateQueryInfo('ordersHistory', require('@tgin/sale/pub/gql/order/query/list.gql')),
  },
  data() {
    return {
      scrollHeight: 100,
      queries: {
        ordersHistory: {
          vars: {
            filter: {
              MODE: 'history'
            },
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

    ordersActive() {
      return this.$store.getters['sale_pub/userOrdersActive'].slice(1)
    },

    ordersHistory() {
      return this.queries.ordersHistory.result ? this.queries.ordersHistory.result.nodes : []
    },

    onResizeDebounced() {
      return this.$util.base.debounce(this.onResize, 100)
    },

    onToggle() {
      setTimeout(() => {
        this.onResizeDebounced()
      }, )
    },
  },
  methods: {

    onResize() {

      if (this.$refs.items) {

        const rect = this.$refs.com.getBoundingClientRect()

        const itemsTop = parseInt(rect.y)
        const itemsHeight = this.$refs.items.$el.clientHeight
        const bottomHeight = this.$refs.bottom.clientHeight
        const windowHeight = window.innerHeight

        const maxHeight = windowHeight - itemsTop - bottomHeight - 50;

        let height = itemsHeight > maxHeight ? maxHeight : itemsHeight

        this.scrollHeight = height
      }

    },
  },
  watch: {
    '$q.screen.height'(v) {
      this.onResizeDebounced()
    },
    'ordersActive'(v) {
      this.$nextTick(()=>{
        this.onResizeDebounced()
      })
    },
    'ordersHistory'(v) {
      this.$nextTick(()=>{
        this.onResizeDebounced()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onResizeDebounced()
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
