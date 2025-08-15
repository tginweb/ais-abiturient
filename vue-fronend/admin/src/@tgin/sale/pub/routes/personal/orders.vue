<template>

  <component
      v-bind="pageViewBind"
      :header="$q.screen.gt.md"
      :path="pagePathFull"
      :title="page.title"
      class=""
  >
    <div class="q-px-md q-px-lg-none q-mt-md q-mt-lg-none">

      <div
          v-if="ordersActiveResult && !ordersActiveResult.length && ordersHistoryResult && !ordersHistoryResult.nodes.length"
      >
        заказы не найдены
      </div>

      <div v-else>

        <div class="q-mb-lg">

          <div class="profile-section-header s-font-md-xl text-weight-bold">Активные заказы</div>

          <ui-query
              :pagerEnable="false"
              :pagerInfinity="true"
              :queryHandler="()=>$apollo.queries.ordersActive"
              :queryResult.sync="ordersActiveResult"
              :queryState.sync="ordersActiveState"
              :queryVars="ordersActiveVars"
          >
            <template v-slot:default="{items, firstLoaded, loading}">

              <div
                  v-if="items.length"
                  class="c-orders"
              >
                <entity-sale-order-teaser
                    v-for="item of items"
                    :key="item.ID"
                    :entityData="item"
                    :nav="true"
                    context-view="list"
                    class=" bg-white q-pa-md border-1 border-primary-brown-gray-1 q-mb-md"
                />

              </div>

              <div v-if="!items.length && firstLoaded" class="text-primary-brown-gray-4">
                нет активных заказов
              </div>

            </template>

          </ui-query>

        </div>

        <div class="q-mb-md">

          <div class="profile-section-header s-font-md-xl text-weight-bold">Прошлые заказы</div>

          <ui-query
              :pagerInfinity="true"
              :queryHandler="()=>$apollo.queries.ordersHistory"
              :queryResult.sync="ordersHistoryResult"
              :queryState.sync="ordersHistoryState"
              :queryVars="ordersHistoryVars"
          >
            <template v-slot:default="{items, firstLoaded}">

              <div
                  v-if="items.length"
                  class="c-orders border-primary-brown-gray-1 border-1"
              >
                <entity-sale-order-row
                    v-for="item of items"
                    :key="item.ID"
                    :entityData="item"
                    :nav="true"
                    class=" bg-white q-pa-md border-b-1 border-primary-brown-gray-1 border-b-last-0 qx-mb-1px q-mb-lg-none"
                />
              </div>

              <div v-if="!items.length && firstLoaded" class="text-primary-brown-gray-4">
                нет прошлых заказов
              </div>

            </template>
          </ui-query>

        </div>

      </div>

    </div>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MRouteNav from "@tgin/main/router/mixin/route-nav"
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  name: 'page.profile.orders',
  mixins: [MRoute, MRouteNav],
  components: {},
  apollo: {

    ordersActive: generateQueryInfo('ordersActive', require('@tgin/sale/pub/gql/order/query/recordset.gql'), {
      fetchPolicy: 'no-cache',
      prefetch: false,
    }, {
      varPath: 'ordersActiveVars',
      resPath: 'ordersActiveResult',
      statePath: 'ordersActiveState',
    }),

    ordersHistory: generateQueryInfo('ordersHistory', require('@tgin/sale/pub/gql/order/query/recordset.gql'), {
      fetchPolicy: 'no-cache',
      prefetch: false,
    }, {
      varPath: 'ordersHistoryVars',
      resPath: 'ordersHistoryResult',
      statePath: 'ordersHistoryState',
    }),

  },
  data() {
    return {
      queriesLoading: 0,
      page: {
        title: 'Заказы',
      },

      ordersHistoryResult: null,
      ordersHistoryState: {
        isLoading: false,
        skip: false
      },

      ordersActiveVars: {
        orderDetail: true,
        filter: {
          MODE: 'active',
        },
        nav: {
          limit: 4
        }
      },

      ordersActiveResult: null,
      ordersActiveState: {
        isLoading: false,
        skip: false
      },

    }
  },
  computed: {
    ordersHistoryVars() {
      return {
        orderDetail: true,
        filter: {
          MODE: 'history',
        },
        nav: {
          ...this.routeNav,
          limit: 12
        }
      }
    }
  },
  methods: {

    refetch() {
      console.log('REFETCH')
      this.$apollo.queries.ordersActive.refetch()
      this.$apollo.queries.ordersHistory.refetch()
    },

  },
  created() {
    this.$bus.on('entity:order.changed', this.refetch);
  },
  beforeDestroy() {
    this.$bus.off('entity:order.changed', this.refetch);
  },
  watch: {}
}
</script>
<style lang="scss" scoped>

.c-orders {
  @media (max-width: $breakpoint-md-max) {
    border-radius: 4px;
    overflow: hidden;
  }
}

</style>
