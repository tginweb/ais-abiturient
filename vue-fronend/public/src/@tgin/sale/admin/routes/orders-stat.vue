<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="pageTitle"
      dialogWidth="1150px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >
    <template v-slot:default="ctx">

      <ui-data-source
          :data.sync="orders"
          ref="orders"
      />

      <ui-data-source
          :data.sync="ordersBasket"
          :filter="orders.filter"
          :where="orders.where"
      />

      <q-splitter
          v-model="splitterFilter"
          :limits="[0, 100]"
          class="c-layout"
          separator-class="bg-grey-2"
          style="height: calc(100vh - 50px);"
      >

        <template v-slot:before>

          <ui-data-filters
              v-model="orders.filter"
              :filter-schema="orders.filterSchema"
              :expanded="['DATE']"
              class="q-py-sm q-px-md"
          />

        </template>

        <template v-slot:after>

          <div class="q-px-md">

            <q-tabs
                v-model="tab"
                active-color="primary"
                align="left"
                class=" text-secondary border-b-12 border-primary"
                dense
                indicator-color="primary"
                narrow-indicator
            >
              <q-tab label="Статистика по заказам" name="stat"/>
              <q-tab label="Товары в заказах" name="basket"/>
              <q-tab label="Заказы" name="orders"/>
            </q-tabs>

            <div>

              <q-tab-panel class="q-px-none q-pb-none" name="orders" v-show="tab==='orders'">

                <c-table-orders
                    height="calc(100vh - 200px)"
                    :info="orders.info"
                    :rows="orders.rows"
                    :nav.sync="orders.nav"
                    :status="orders.status"
                    :handler="() => $refs.orders.$apollo.queries.recordset"
                />

              </q-tab-panel>

              <q-tab-panel class="q-px-none relative-position" name="basket" v-show="tab==='basket'">

                <c-table-order-basket-items
                    :loading="ordersBasket.status.loading"
                    :pagination="ordersBasket.pagination"
                    :items="basketItems"
                    @update:pagination="onPagerUpdate"
                />

              </q-tab-panel>

              <q-tab-panel class="q-px-none" name="stat" v-show="tab==='stat'">

                <div class="relative-position">

                  <div class="row q-col-gutter-md">

                    <div class="col-md-5">

                      <div class="bg-grey-3 q-px-md q-pa-sm q-mb-md">
                        Вид отчета
                      </div>

                      <q-option-group
                          v-model="pivot.preset"
                          :options="$store.getters['sale_admin/pivotPresets']"
                          emit-value
                          label="Вид отчета"
                          option-label="label"
                          option-value="id"
                          outlined
                          map-options
                          class="s-font-xs"
                      />

                    </div>

                    <div class="col-md-19">

                      <div class="bg-grey-3 q-px-md q-pa-sm q-mb-md flex items-center">
                        <div>Отчет</div>

                        <q-checkbox
                            label="Настроить отчет"
                            v-model="pivot.editable"
                            dense
                            class="q-ml-auto"
                            v-if="$store.getters['user/isShopAdmin']"
                        />

                      </div>

                      <div class="q-mb-md q-gutter-sm">
                        <div>
                          Количество заказов: <b>{{ orders.info.total }}</b>
                        </div>
                        <template v-if="false">
                          <div v-for="(quantity,measure) of basketItemsQuantity">
                            Количество товаров: <b>{{ quantity }} {{ measure }}</b>
                          </div>
                        </template>
                      </div>

                      <c-pivot
                          :items="basketItems"
                          :editable="pivot.editable"
                          :preset="pivot.preset"
                      />

                    </div>

                  </div>

                  <q-inner-loading :showing="ordersBasket.status.loading">
                    <q-spinner-gears color="primary" size="50px"/>
                  </q-inner-loading>

                </div>

              </q-tab-panel>

            </div>

          </div>

        </template>
      </q-splitter>


    </template>

  </component>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'
import CTableOrders from "@tgin/sale/admin/component/order/list/table";
import CTableOrderBasketItems from "@tgin/sale/admin/component/order-basket-item/list/table";
import CPivot from "@tgin/sale/admin/component/order/pivot";

export default {
  mixins: [MVroute],
  components: {
    CTableOrders,
    CTableOrderBasketItems,
    CPivot
  },
  props: {},
  data() {
    const now = Date.now()
    //const nowYear = parseInt(this.$util.date.timestampToFormat(now, 'YYYY'))
    const nowYear = 2021
    const nowMonth = parseInt(this.$util.date.timestampToFormat(now, 'M'))

    return {
      orders: {
        recordsetQuery: () => require('../gql/order/query/recordset.gql'),
        filterQuery: () => require('../gql/order/query/filters.gql'),
        filterSchema: [],
        filter: {
          DATE_YEAR: nowYear,
          DATE_MONTH: nowMonth,
        },
        where: {
          MODE: this.viewId,
        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 50
        },
        status: {
          loaded: false,
          loading: false,
        },
      },
      ordersBasket: {
        query: () => require('../gql/order/query/basket_items.gql'),
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 50000
        },
        pagination: {
          rowsPerPage: 50000
        },
        status: {
          loaded: false,
          loading: false,
        },
      },
      tab: 'stat',
      splitterFilter: 15,
      page: {
        title: 'Отчет',
      },
      pivot: {
        preset: 'by_rootsection',
        editable: false
      }
    }
  },
  created() {

  },
  computed: {
    views() {
      return [
        {id: 'active', label: 'Активные'},
        {id: 'completed', label: 'Завершенные'},
        {id: 'canceled', label: 'Отмененные'},
        {id: 'all', label: 'Все'},
      ]
    },
    pageTitle() {
      return 'Заказы: ' + (this.view ? this.view.label : '')
    },
    basketItems() {
      return this.$store.getters['sale_admin/basketItemsFilled'](this.ordersBasket.rows)
    },
    basketItemsQuantity() {
      return this.basketItems.reduce((map, item) => {
        if (!map[item.MEASURE_NAME]) {
          map[item.MEASURE_NAME] = 0;
        }
        map[item.MEASURE_NAME] += item.QUANTITY
        return map
      }, {})
    },
  },
  watch: {
    viewId(val) {
      this.orders.filter = {}
      this.orders.nav.page = 1
      this.orders.where.MODE = val
    }
  },
  methods: {
    onPagerUpdate(pager) {

      this.ordersBasket.nav.limit = pager.rowsPerPage

      this.ordersBasket.pagination = pager
    },
    basketItemsRefetch() {
      this.$apollo.queries.orderItems.refetch()
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
