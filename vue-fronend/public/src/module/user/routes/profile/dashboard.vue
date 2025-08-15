<template>

  <CPage
    :header="$q.screen.gt.md"
    :path="pagePathFull"
  >
    <CCard v-if="$q.screen.lt.lg"/>

    <div class="c-sections q-pa-md">

      <div class="c-section">

        <div class="c-section__blocks">

          <div class="row q-col-gutter-md">

            <div class="col-12 col-md-8">

              <div class="c-block">
                <div class="c-block__title">
                  Заказы
                </div>
                <div class="c-block__content">
                  <div class="c-block__value">{{ $store.getters['user/user'].ORDERS_COUNT }}</div>
                </div>
              </div>

            </div>

            <div class="col-12 col-md-8" v-if="false">

              <div class="c-block">
                <div class="c-block__title">
                  Баллов
                </div>
                <div class="c-block__content">
                  <div class="c-block__value">0</div>
                </div>
              </div>

            </div>

            <div class="col-24 col-md-8" v-if="false">

              <div class="c-block">
                <div class="c-block__title">
                  Ваш промокод
                </div>
                <div class="c-block__content flex">

                  <div class="c-block__value">{{ promocode }}</div>

                  <div class="q-ml-auto">
                    <q-btn
                      :icon="$icons.copy"
                      class="--no-wrapper --leading-none"
                      dense
                      flat
                      size="md"
                      @click="onPromocodeCopy"
                    />
                  </div>

                </div>
              </div>

            </div>

          </div>


        </div>

      </div>

      <div v-if="ordersActiveResult && ordersActiveResult.nodes.length || ordersActiveState.isLoading"
           class="c-section">

        <div class="c-section__header">Активные заказы</div>

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
                class=" bg-white q-pa-md border-b-lg-1 border-primary-brown-gray-1 border-b-last-0 qx-mb-1px  q-mb-lg-none"
                @changed="onOrderChanged"
              />

            </div>

            <div v-if="!items.length && firstLoaded" class="text-primary-brown-gray-4">
              нет активных заказов
            </div>

          </template>

        </ui-query>

      </div>

      <div class="c-section" v-if="false">

        <div class="c-section__header">
          Уведомления
        </div>

        <div class="c-section__body">

          <ui-items-grid
            :item="{
              is: 'notice-entity-view',
              class: 'col-24 q-pa-md ui-mb-1px bg-white',
            }"
            :items="$store.state.notice.lastNotices"
            class="c-notices"
          />

        </div>

      </div>

    </div>

    <div v-if="$q.screen.lt.lg" class="q-pa-md">

      <ui-nav-vertical-mobile
        :chevron="true"
        :counter="true"
        :excludeCurrent="true"
        :items="$store.getters['user/userMenu'].filter(item => item.CODE !== 'profile')"
        iconClass="min-width-auto q-pr-2md"
        itemClass="border-primary-brown-gray-1 border-b-1 border-b-last-0 leading-md"
      />

      <q-btn
        class="full-width"
        color="dark"
        flat
        label="Выйти из профиля"
        v-if="false"
      />

    </div>

  </CPage>

</template>

<script>
import CPage from "../../component/profile/page"
import MRoute from "../../component/profile/route.mixin"
import generateQueryInfo from "@common/graphql/lib/generate-query-info"
import CCard from "../../component/profile/shared/card"
import {copyToClipboard} from 'quasar'

export default {
  name: 'page.profile',
  mixins: [MRoute],
  apollo: {
    ordersActive: generateQueryInfo('ordersActive', require('~module/sale/gql/order/query/userOrdersActive.gql'), {
      fetchPolicy: 'no-cache',
      prefetch: false
    }, {
      varPath: 'ordersActiveVars',
      resPath: 'ordersActiveResult',
      statePath: 'ordersActiveState',
    }),

  },
  components: {
    CPage,
    CCard
  },
  data() {
    return {
      page: {
        title: 'Личный кабинет'
      },
      ordersActiveVars: {
        nav: {
          limit: 2
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
    pagePath() {
      return []
    },

    promocode() {
      return this.$store.getters['user/user'].PROMOCODE
    }
  },
  methods: {
    onOrderChanged() {
      this.$apollo.queries.ordersActive.refetch()
    },

    onPromocodeCopy() {
      if (this.promocode) {
        copyToClipboard(this.promocode)
          .then(() => {
            this.$bus.emit('processMessage', {message: 'Промокод скопирован'})
          })
          .catch(() => {
            // fail
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.c-sections {
  background-color: #F8F5F2;
}

.c-block {
  padding: 12px;
  background-color: #fff;
  height: 100%;

  .c-block__title {
    margin-bottom: 8px;
  }

  .c-block__value {
    font-size: 20px;
  }
}

.c-section {

  &:not(:last-child) {
    margin-bottom: 24px;
  }

  .c-section__header {
    margin-bottom: 16px;
  }

  .c-section__body {

  }
}


.c-menu__item {
  padding: 10px 0 10px 0;
}


</style>
