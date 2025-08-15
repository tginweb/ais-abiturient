<template>

  <component
      v-bind="bindRouterWrapper"
      :path="pagePathFull"
      :title="pageTitle"
      @hide="onHide"
  >

    <div id="favs" class="q-mb-xl">
      <h3 class="s-font-2xl">Добавленные в избранное</h3>
      <ui-query
          :minHeightEnable="true"
          :pagerInfinity="true"
          :queryHandler="()=>$apollo.queries.favElements"
          :query="queries.favElements"
      >
        <template v-slot:default="{items, onNavMore}">

          <ui-items-grid
              v-if="items"
              :item="{
                        is: 'catalog-product-element-card',
                        class: 'col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6',
                        elements: {

                        }
                      }"
              :items="items"
              class="c-items"
              rowClass=""
          />

        </template>
      </ui-query>
    </div>

    <ui-query
        :minHeightEnable="true"
        :pagerInfinity="true"
        :queryHandler="()=>$apollo.queries.bestsellerElements"
        :query="queries.bestsellerElements"
    >
      <template v-slot:default="{items, onNavMore}">

        <div id="sales" class="q-mb-xl" v-if="items && items.length">

          <h3 class="s-font-2xl">Часто заказываемые товары</h3>
          <ui-items-grid
              v-if="items"
              :item="{
                  is: 'catalog-product-element-card',
                  class: 'col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6',
                  elements: {

                    }}"
              :items="items"
              class="c-items "
              rowClass=""
          />
        </div>
      </template>

    </ui-query>

    <div id="orders" class="q-mb-xl" v-if="queries.orders.result && queries.orders.result.length">

      <h3 class="s-font-2xl">Последние заказы</h3>

      <div class="c-orders border-primary-brown-gray-1 border-1">
        <entity-sale-order-row
            v-for="order in queries.orders.result.nodes"
            :key="order.ID"
            :entity-data="order"
            :nav="true"
            class=" bg-white q-pa-md border-b-1 border-primary-brown-gray-1 border-b-last-0 qx-mb-1px q-mb-lg-none"
        />
      </div>

      <q-btn
          label="Вся история заказов"
          to="/personal/order"
          class="q-mt-md"
          color="primary"
          outlined
      />

    </div>

  </component>


</template>

<script>
import CLayout from '~app/layout/site/page/1cols'
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'
import MHashNav from "@tgin/main/common/mixin/hashnav";
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  mixins: [MRoute, MVRoute, MHashNav],
  components: {
    CLayout,
  },
  apollo: {
    favElements: generateQueryInfo('favElements', require('@tgin/catalog/core/gql/product/query/productElements.gql')),
    bestsellerElements: generateQueryInfo('bestsellerElements', require('@tgin/catalog/core/gql/product/query/productElements.gql')),
    orders: generateQueryInfo('orders', require('@tgin/sale/pub/gql/order/query/list.gql')),
  },
  data() {
    return {
      navLoading: false,
      navTimeout: null,
      page: {
        title: 'Избранное'
      },
      queries: {
        favElements: {
          vars: {
            nocache: true,
            filter: {
              IN_FAVORITES: true
            },
            nav: {
              limit: 50
            }
          },
          state: {
            isLoading: false,
            skip: false
          },
          result: null
        },
        bestsellerElements: {
          vars: {
            nocache: true,
            filter: {
              IN_USER_BESTSELLERS: true
            },
            nav: {
              limit: 20
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
            orderDetail: true,
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
  created() {
    this.$bus.on('fav.changed', this.onFavChanged)
  },
  beforeDestroy() {
    this.$bus.off('fav.changed', this.onFavChanged)
  },
  computed: {
    routeBase() {
      return this.$route.path
    },
    breadcrumbs() {
      let path = [
        {label: 'Любимые товары', url: '/favorites'},
      ]
      return path
    },
  },
  watch: {
    section(val) {
      // this.queries.elements.state.skip = !val
    },
    'routeUrl': {
      handler: function (nav) {
        history.pushState({}, '', this.routeUrl)
      },
      deep: true
    },

    '$store.state.favorites.favoritesIds'() {
      this.$apollo.queries.elements.refetch();
    }
  },
  methods: {

    onFavChanged(params) {
      if (params.actions === 'add') {
        this.$apollo.queries.elements.refetch()
      }
    },

    onSortModeClick(sortMode) {
      if (this.routeNav.sort !== sortMode.value) {
        this.routeNav.sort = sortMode.value
        this.routeNav.asc = sortMode.asc
      } else {
        this.routeNav.asc = !this.routeNav.asc
      }

      this.routeNav.page = 1
    }
  },

}
</script>
<style lang="scss" scoped>

</style>
