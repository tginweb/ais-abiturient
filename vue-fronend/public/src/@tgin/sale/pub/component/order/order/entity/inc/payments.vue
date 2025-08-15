<template>

  <div class="c-payments">


    <div class="q-mb-md">

      <div class="text-primary-brown-gray-3">Оплата</div>

      <div class="q-gutter-sm" v-if="order.PAYMENTS.length">

        <div
            v-for="payment of order.PAYMENTS"
            :key="payment.ID"
            class="flex no-wrap"
        >

          <div class="q-mr-sm">

            {{ payment.PAYSYSTEM.NAME }} на

            <b style="white-space: nowrap;">
              {{ $util.format.price(payment.SUM, true) }}
            </b>

            <template v-if="payment.PAYSYSTEM.IS_ONLINE || payment.IS_PAID">
              -
              <b v-if="!payment.IS_PAID" class="text-actions-red">не оплачен</b>
              <b v-else class="text-primary">оплачен</b>
            </template>

          </div>

        </div>

      </div>

      <div v-else>

        {{ order.PAY_SYSTEM_NAME }}

      </div>

    </div>

    <template v-if="order.PAY_SYSTEM_IS_ONLINE && false">

      <div class="q-mb-md">
        <div class="text-primary-brown-gray-3">Когда оплатить</div>
        <div>
          {{ propsByCode.ONLINE_PAYMENT_WHEN.VALUE_VIEW }}
        </div>
      </div>

      <div class="q-mb-md" v-if="cardName">
        <div class="text-primary-brown-gray-3">Карта для оплаты</div>
        <div>
          {{ cardName }}
        </div>
      </div>

    </template>

    <div v-if="order.COUPONS && order.COUPONS.length">
      <div class="text-primary-brown-gray-3">Промокод</div>
      <div class="q-gutter-sm">
        <div
            class="c-line flex no-wrap"
            v-for="coupon of order.COUPONS"
            :key="coupon.ID"
        >
          <div class="q-mr-sm">
            <u>{{ coupon.COUPON }}</u> - {{ coupon.DISCOUNT_NAME }}
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

export default {
  props: {
    order: {},
    propsByCode: {}
  },

  computed: {

    cardName() {
      const cardKey = this.propsByCode.ONLINE_PAYMENT_CARD_ID.VALUE

      if (parseInt(cardKey) === -1) {
        return 'Новая карта'

      } else {
        let card = this.$store.getters['sale_pub/userPaymentCardsByKey'][cardKey]

        if (card)
          return 'Карта ' + card['UF_LAST_DIGHTS']
      }
    }
  }
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
