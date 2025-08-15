<template>
  <div class="basket container nopad-lt-md q-mt-lg">

    <q-scroll-observer @scroll="scrollHandler"/>

    <ui-progress-inner-loading
        :value="requestState.fetching"
    />

    <div v-if="isMounted">

      <template v-if="!basketIsEmpty">

        <div class="row q-col-gutter-md q-col-gutter-md-2lg">

          <div class="col-24 col-lg-17 ">

            <div class="q-px-md q-px-md-none q-pt-md q-pb-lg  lt-lg">

              <q-linear-progress
                  :value="$store.getters['sale_pub/vorderDeliveryFreeProgress']"
                  class="q-mb-sm"
                  color="primary-green-4"
              />

              <template v-if="$store.getters['sale_pub/vorderDeliveryFreeDelta'] > 0">

                До бесплатной доставки {{ $util.format.price($store.getters['sale_pub/vorderDeliveryFreeDelta']) }}

              </template>
              <template v-else>

                Поздравляем! Вы получили бесплатную доставку на заказ!

              </template>

            </div>

            <div class="c-items relative-position">

              <div
                  class="c-items-control flex border-t-1 border-t-md-0  border-b-1 q-mb-sm border-primary-brown-gray-1 border-b-last-0"
              >
                <q-btn
                    class="q-ml-auto q-px-none"
                    color="primary"
                    :to="{name: 'sale:basket.clear'}"
                    flat
                    label="Очистить корзину"
                />
              </div>

              <component
                  :is="$q.screen.gt.sm ? 'CBasketItemDesktop' : 'CBasketItemMobile'"
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

              <div class="border-b-1 border-primary-brown-gray-1 q-px-md q-px-md-lg q-pt-lg q-pb-md gt-md">

                <q-linear-progress
                    :value="$store.getters['sale_pub/vorderDeliveryFreeProgress']"
                    class="q-mb-sm"
                    color="primary-green-4"
                />

                <div v-if="$store.getters['sale_pub/vorderDeliveryFreeDelta'] > 0" class=" s-font-sm">

                  До бесплатной доставки
                  <b>{{ $util.format.price($store.getters['sale_pub/vorderDeliveryFreeDelta']) }}</b>

                </div>
                <template v-else>

                  Поздравляем! Вы получили бесплатную доставку на заказ!

                </template>

                <div class="q-mt-sm s-font-xs text-primary-brown-gray-6 flex">

                  <template v-if="!vorderData.DELIVERY_CALCULATED">
                    <div class="text-weight-bold q-mr-sm">Расчитано:</div>
                    <div>
                      в пределах КАД
                    </div>
                  </template>
                  <template v-else-if="vorderPropsValue.ADDRESS">
                    <div class="text-weight-bold q-mr-sm">Расчитано до:</div>
                    <div>
                      {{ vorderPropsValue.ADDRESS }}
                    </div>
                  </template>

                </div>

              </div>

              <div class="c-summary__info q-px-md q-px-md-lg q-pt-lg q-pb-md">

                <div class="c-summary-title text-weight-bold">Ваш заказ</div>

                <div class="text-grey-6">
                  {{ basket.COUNT }} товаров <span v-if="basket.WEIGHT && false">{{ basket.WEIGHT }} кг</span>
                </div>

                <div class="q-gutter-y-sm q-mt-sm q-mb-md q-pb-md border-b-1 border-primary-brown-gray-1">

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

                <div class="q-mt-sm flex items-center leading-none">

                  <div class="c-summary-title text-weight-bold">Итого</div>

                  <div class="c-summary-price text-weight-bold s-font-4xl text-weight-bold q-ml-auto">
                    {{ $util.format.price($store.getters['sale_pub/vorderData'].ORDER_TOTAL_PRICE, true) }}
                  </div>

                </div>

              </div>

              <div class="c-summary__order q-px-md q-pt-sm q-pa-md-lg" v-intersection="onSummaryIntersect">

                <q-btn
                    class="full-width"
                    color="primary"
                    label="Перейти к оформлению"
                    to="/order"
                    unelevated
                    :disable="$store.getters['sale_pub/basketBusy']"
                    v-if="parseInt(basket.PRICE) >= 1000"
                />
                <div v-else class="">

                  <div class="">

                    <div class="text-red">Минимальная сумма для оформления заказа - 1000 руб.</div>

                    <div class="q-mt-sm">
                      Можно добавить количество товаров в корзине или
                    </div>

                    <div class="q-mt-sm">
                      <q-btn
                          label="перейти в каталог"
                          to="/Catalog/"
                          color="primary"
                          class="full-width"

                      />
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div
            class="c-summary-sticky q-px-md q-py-sm  lt-md border-t-1 border-primary-brown-gray-1 bg-primary-brown-1"
            style="position: fixed; z-index: 2; bottom: 0; left: 0; width: 100%;"
            v-if="!summaryIntersect"
        >

          <div class="flex items-center no-wrap">

            <div>

              <div class="text-weight-bold q-mb-xs">

                {{ $util.format.price($store.getters['sale_pub/vorderData'].ORDER_TOTAL_PRICE, true) }}

              </div>

              <div class="text-grey-6">
                {{ basket.COUNT }} товаров <span v-if="basket.WEIGHT && false">{{ basket.WEIGHT }} кг</span>
              </div>

            </div>

            <div class="q-ml-auto" style="max-width: 50%">

              <q-btn
                  class="full-width s-font-xs"
                  color="primary"
                  label="Оформить заказ"
                  @click="onNavOrder"
                  unelevated
                  :disable="$store.state.sale_pub.sess.basket.fetching || $store.state.sale_pub.sess.vorder.fetching"
                  v-if="parseInt(basket.PRICE) >= 1000"
              />
              <div v-else class="text-red">
                минимальная сумма заказа 1000 руб.
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

  </div>
</template>

<script>
import CBasket from "./basket";

export default {
  extends: CBasket,
  data() {
    return {
      vorderRefetch: true,
    }
  },
  async mounted() {
    await this.fetch()
  },
}
</script>

<style lang="scss" scoped>


@media (max-width: $breakpoint-sm-max) {
  .c-summary {
    border-top: 1px solid #EFEEEE;
  }
}

@media (min-width: $breakpoint-md-min) {

  .c-items {
    border: 1px solid #EFEEEE;
  }

  .c-summary {
    border: 1px solid #EFEEEE;

    .c-summary__info {
      border-bottom: 1px solid #ddd;
    }

    .c-summary__freedeliver {
      border-bottom: 1px solid #ddd;
    }
  }
}

</style>
