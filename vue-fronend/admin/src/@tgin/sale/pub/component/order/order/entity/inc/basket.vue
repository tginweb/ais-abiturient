<template>

  <div class="c-basket">

    <div class="c-basket__table">
      <div
        v-for="basketItem of items"
        :key="basketItem.ID"
        class="c-basket__item q-py-sm border-b-md-1 border-primary-brown-1"
      >
        <div class="row q-col-gutter-md">

          <div class="col-4">

            <img
              v-if="basketItem.ELEMENT && basketItem.ELEMENT.LIST_IMAGE"
              :src="$image.resolveUrl(basketItem.ELEMENT.LIST_IMAGE.SRC, 'r100')"
            />

          </div>

          <div class="col-15">
            <div>{{ basketItem.NAME }}</div>
            <div class="text-primary-brown-gray-4">
              {{ basketItem.QUANTITY }}
              <span v-if="basketItem.ELEMENT">{{basketItem.ELEMENT.MEASURE.NAME}}</span>
            </div>
          </div>

          <div class="col-5 text-right">
            <nobr>{{ $util.format.price(basketItem.FINAL_PRICE_BASE) }} </nobr>
          </div>

        </div>
      </div>
    </div>

    <div class="c-basket__summary q-py-sm border-t-2 border-primary-brown-1" v-if="!hideSummary">

      <div class="row q-col-gutter-x-md ">

        <div class="col-24 col-md-4">

        </div>

        <div class="col-24 col-md-20">


            <div class="c-total__line flex">
              <div>Товары:</div>
              <div class="q-ml-auto">{{ $util.format.price(entity.PRICE_BASKET_BASE, true)}}</div>
            </div>

            <div class="c-total__line flex" v-if="entity.PRICE_DELIVERY">
              <div>Доставка:</div>
              <div class="q-ml-auto">{{ $util.format.price(entity.PRICE_DELIVERY, true) }}</div>
            </div>

            <div class="c-total__line flex text-red" v-if="entity.PRICE_DISCOUNT < -1">
              <div>Скидка:</div>
              <div class="q-ml-auto text-actions-red">{{ $util.format.price(entity.PRICE_DISCOUNT, true)}}</div>
            </div>

            <div class="c-total__line flex " v-if="entity.BONUSES > 0">
              <div>Оплачено бонусами:</div>
              <div class="q-ml-auto ">{{ $util.format.price(entity.BONUSES, true)}}</div>
            </div>

            <div class="c-total__line flex q-mt-sm s-font-lg text-weight-bold">
              <div>Итого:</div>
              <div class="q-ml-auto s-font-xl">{{ $util.format.price(entity.PRICE_PAY, true) }}</div>
            </div>

        </div>

      </div>

    </div>

  </div>

</template>

<script>

export default {
  props: {
    entity: {},
    items: {},
    hideSummary: {default: false}
  },
}
</script>

<style lang="scss" scoped>

.c-status__line {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 1px;
}

</style>
