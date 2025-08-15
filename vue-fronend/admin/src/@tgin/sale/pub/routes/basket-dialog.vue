<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :title="pageTitle"
      @hide="onHide"
  >
    <template v-slot:bottom>

      <div class="flex items-center leading-none q-mb-md">

        <div class="c-summary-title text-weight-bold">Итого</div>

        <div class="c-summary-price text-weight-bold s-font-2xl text-weight-bold q-ml-auto">
          {{ $util.format.price($store.getters['sale_pub/vorderData'].ORDER_TOTAL_PRICE, true) }}
        </div>

      </div>

    </template>

    <template v-slot:default>

      <ui-progress-inner-loading
          :value="requestState.fetching"
      />

      <div v-if="isMounted">

        <template v-if="!basketIsEmpty">

          <div class="row q-col-gutter-md q-col-gutter-md-2lg">

            <div class="col-24 col-lg-17 ">

              <div class="c-items relative-position">

                <component
                    :is="$q.screen.gt.md ? 'CBasketItemDesktop' : 'CBasketItemMobile'"
                    v-for="(item, index) of basketItems"
                    :key="index"
                    :item="item"
                    :class="{
                    'c-item border-b-1 border-primary-brown-gray-1 border-b-last-0': true,
                    'q-py-md q-px-md-md q-mx-md-none': true
                  }"
                    @quantity="onItemQuantity"
                    @remove="onItemRemove"
                    @comment="onItemComment"
                    @commentRemove="onItemCommentRemove"
                    context="order"
                />

              </div>

            </div>

            <div class="col-24 col-lg-7">


              <div class="c-summary  relative-position">

                <ui-progress-inner-loading
                    :value="$store.getters['sale_pub/basketBusy']"
                />


                <div class="c-summary__info border-t-2 border-primary-brown-gray-1 q-pt-md q-pb-sm">

                  <div class="c-summary-title text-weight-bold">Ваш заказ</div>

                  <div class="text-grey-6">
                    {{ basket.COUNT }} товаров <span v-if="basket.WEIGHT && false">{{ basket.WEIGHT }} кг</span>
                  </div>

                  <div class="q-gutter-y-sm q-mt-sm ">

                    <div class="c-summary-line flex">
                      <div>Товары</div>
                      <div class="q-ml-auto">{{ $util.format.price(basket.PRICE, true) }}</div>
                    </div>

                    <div class="c-summary-line flex"
                         v-if="!!vorderData.ORDER_DISCOUNT_PRICE && vorderData.ORDER_DISCOUNT_PRICE<0">
                      <div>Скидка</div>
                      <div class="q-ml-auto text-actions-red">{{
                          $util.format.price(vorderData.ORDER_DISCOUNT_PRICE)
                        }}
                      </div>
                    </div>

                    <div class="c-summary-line flex">
                      <div>Доставка</div>
                      <div class="q-ml-auto">

                        <template v-if="vorderData.DELIVERY_CALCULATED">

                      <span v-if="vorderData.ORDER_DELIVERY_PRICE > 0">
                         {{ $util.format.price(vorderData.ORDER_DELIVERY_PRICE) }}
                      </span>
                          <span v-else class="text-primary">
                         бесплатно
                      </span>

                        </template>

                        <template v-else>
                          не рассчитана
                        </template>

                      </div>
                    </div>

                    <div
                        v-if="vorderData.PAYMENT_WEIGHT_DISCOUNT"
                        class="c-summary-line flex no-wrap  cursor-pointer"
                        @click="showingVesTooltip = !showingVesTooltip"
                        @mouseover="showingVesTooltip=true"

                    >
                      <div style=" line-height: 1.2" class="q-pr-md">
                        <span class="border-b-1 s-font-sm" style="border-bottom-style: dashed;">Весовая наценка при оплате online</span>
                        <span class="cursor-pointer text-red s-font-xl">*</span>
                      </div>

                      <div class="q-ml-auto" style="white-space: nowrap;">
                        {{ $util.format.price(vorderData.PAYMENT_WEIGHT_DISCOUNT, true) }}
                      </div>

                      <q-tooltip
                          content-class="s-font-md bg-primary-brown-1 text-dark border-1 border-primary-brown-gray-5"
                          v-model="showingVesTooltip"
                          :anchor="$q.screen.gt.md ? 'center left' : 'top middle'"
                          :self="$q.screen.gt.md ? 'center right' : 'center middle'"
                          :no-parent-event="$q.screen.lt.md"
                      >
                        <div style="max-width: 330px;">
                          Внимание, итоговая стоимость заказа может измениться после взвешивания товара в пределах 10%
                        </div>
                      </q-tooltip>

                    </div>

                  </div>



                </div>


              </div>

            </div>

          </div>

        </template>

        <div v-else class="border-t-1 border-primary-brown-gray-1 q-py-2lg text-center q-px-md">

          <div class="q-mb-md">
            В корзине пусто, перейдите в каталог, чтобы добавить товары
          </div>

          <q-btn
              class="full-width-lt-sm"
              color="primary"
              label="Перейти в каталог"
              to="/Catalog/"
              unelevated
          />

        </div>

      </div>

    </template>

  </component>

</template>

<script>
import MRoute from "@tgin/main/router/mixin/route-public";
import MVRoute from '@tgin/main/router/mixin/vroute'
import CBasket from "../component/basket/basket";

export default {
  mixins: [MRoute, MVRoute],
  extends: CBasket,
  props: {
    onSuccess: {}
  },
  data() {
    return {
      comment: null,
      showingVesTooltip: false,
      summaryIntersect: false,
      vorderRefetch: true,
      isMounted: false,
    }
  },
  async mounted() {
    await this.fetch()
    this.isMounted = true
  },
  computed: {
    pageTitle() {
      return 'Корзина'
    },
    actions() {
      return [
        {
          label: 'Оформить',
          color: 'primary',
          callback: () => {
            this.visible = false
            this.$router.push('/order')
          }
        },
      ]
    }
  },
  methods: {
    onNavOrder() {
      if (ym)
        ym(8821120, 'reachGoal', 'Oform');

      this.$router.push('/order')
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
