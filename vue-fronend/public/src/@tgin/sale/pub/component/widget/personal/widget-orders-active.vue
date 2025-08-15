<template>
  <div v-bind="bind" v-if="ordersActiveOrHistoryExists">
    <div v-bind="bindInnerComp">
      <div class="c-main">
        <div class="c-header row no-wrap items-center q-col-gutter-md q-col-gutter-md-lg ">
          <div class="c-title col-shrink q-mr-auto">
            <div class="c-title s-font-md s-font-md-lg s-font-lg-lg s-font-xl-xl text-weight-bold">
              {{titleComp}}
            </div>
          </div>
          <div>
            <q-btn
                v-if="ordersActiveOrHistoryExists"
                :label="$q.screen.gt.md ? 'все заказы' : null"
                :to="{name: 'sale:orders'}"
                class="c-header-more-link"
                color="dark"
                :icon-right="$icons.chevronRight"
                flat
                dense
            />
          </div>
        </div>
        <div class="c-content q-mt-sm">

          <template v-if="ordersActive.length">
            <template v-if="ordersActive.length===1">
              <entity-sale-order-teaser
                  v-for="item of ordersActive"
                  :key="item.ID"
                  :entityData="item"
                  :nav="true"

                  :basket-hide="true"
                  :compact="true"
                  class="border-b-1 border-primary-brown-gray-1 border-b-last-0 qx-pb-last-none qx-mb-last-none q-pb-md q-mb-md"
              />
            </template>
            <template v-else>
              <entity-sale-order-row
                  v-for="item of ordersActive"
                  :key="item.ID"
                  :entityData="item"
                  :nav="true"
                  :actionsOutline="true"
                  class="border-b-1 border-primary-brown-gray-1 border-b-last-0 qx-pb-last-none qx-mb-last-none q-pb-md q-mb-md"
              />
            </template>
          </template>

          <template v-else-if="ordersHistory.length">
            <template v-if="ordersActive.length===1">
              <entity-sale-order-teaser
                  v-for="item of ordersHistory"
                  :key="item.ID"
                  :entityData="item"
                  :nav="true"
                  :actionsOutline="true"
                  class="border-b-1 border-primary-brown-gray-1 border-b-last-0 qx-pb-last-none qx-mb-last-none q-pb-md q-mb-md"
              />
            </template>
            <template v-else>
              <entity-sale-order-row
                  v-for="item of ordersHistory"
                  :key="item.ID"
                  :entityData="item"
                  :nav="true"
                  :actionsOutline="true"
                  class="border-b-1 border-primary-brown-gray-1 border-b-last-0 qx-pb-last-none qx-mb-last-none q-pb-md q-mb-md"
                  :compact="true"
              />
            </template>
          </template>
          <template v-else>
            пока нет заказов
          </template>

        </div>

      </div>

    </div>

  </div>

</template>

<script>

import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

import Parent from '@tgin/user/pub/component/profile/widget/widget'

export default {
  extends: Parent,
  apollo: {
    ordersActive: generateQueryInfo('ordersActive', require('@tgin/sale/pub/gql/order/query/list.gql'), {
      fetchPolicy: 'no-cache',
      prefetch: false
    }),
    ordersHistory: generateQueryInfo('ordersHistory', require('@tgin/sale/pub/gql/order/query/list.gql'), {
      fetchPolicy: 'no-cache',
      prefetch: false
    })
  },
  data() {
    return {
      queries: {
        ordersActive: {
          vars: {
            filter: {
              MODE: 'active'
            },
            nav: {
              limit: 1
            }
          },
          state: {
            isLoading: false
          },
          result: null
        },
        ordersHistory: {
          vars: {
            filter: {
              MODE: 'history'
            },
            nav: {
              limit: 2
            }
          },
          state: {
            isLoading: false
          },
          result: null
        },
      },
      ordersResult: null,
      ordersState: {
        isLoading: false,
        skip: false
      },
      isMounted: false
    }
  },
  methods: {
    fetchBonuses() {
      this.$store.dispatch('sale_pub/userBonusesEnsure')
    }
  },
  created() {
    this.fetchBonuses()
  },
  computed: {
    ordersActiveOrHistoryExists() {
      return this.ordersActive.length || this.ordersHistory.length
    },
    ordersActive() {
      return this.queries.ordersActive.result || []
    },
    ordersHistory() {
      return this.queries.ordersHistory.result || []
    },
    bindInnerComp() {
      const res = this.bindInner
      if (this.ordersActive.length) {
        res.style.backgroundColor1 = 'rgb(250 249 242)'
      }
      return res
    },
    titleComp() {
      if (this.ordersActive.length) {
        return 'Активные заказы'
      } else if (this.ordersHistory.length) {
        return 'История заказов'
      }
      return 'Заказы'
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
