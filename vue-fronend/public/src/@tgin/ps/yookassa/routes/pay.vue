<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :title="pageTitle"
      dialogWidth="550px"
      @hide="onHide"
  >
    <template v-slot:default>

      <div v-if="step==='start'">

        <div class="row q-gutter-x-sm q-gutter-y-sm q-mb-md">

          <div class="col-24 col-md-8">
            <div class="text-primary-brown-gray-3">Сумма оплаты</div>
            <div class="s-font-3xl s-font-md-5xl">
              <b>{{ payment.SUM | price }}</b>
            </div>
          </div>

          <div class="col-24 col-md-15 q-mr-auto">


          </div>

        </div>

        <div class="q-mb-md">

          <q-select
              v-if="cardOptions.length > 1"
              v-model="cardSid"
              :options="cardOptions"
              emit-value
              label="Карта для оплаты"
              map-options
              option-label="NAME"
              option-value="VALUE"
          />

        </div>

        <div v-if="cardIsNew" class="flex no-wrap">

          <div>
            <q-checkbox v-model="autopayAllow"/>
          </div>

          <div>

            <div class="cursor-pointer q-mt-sm" @click="autopayAllow = !autopayAllow">Разрешить автописание средств
            </div>

            <div class="text-actions-orange s-font-sm q-mt-sm">
              Авоплатежи позволяют списывать фактическую сумму заказа автоматически после взвешивания.
            </div>

          </div>

        </div>

      </div>

      <div v-if="step==='widget'">

        <div id="yookassa-widget">

        </div>

      </div>

    </template>
  </component>

</template>

<script>
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  components: {},
  props: {
    onSuccess: {},
    orderHash: {},
    paymentId: {},
  },
  data() {
    return {
      comment: null,
      psData: {},
      valueState: null,
      autopayAllow: true,
      step: 'start',
      cardSid: null
    }
  },
  computed: {

    cardOptions() {
      const result = [...this.$store.getters['sale_pub/userPaymentCards']]

      result.push({
        NAME: 'Новая карта',
        VALUE: 'new',
      })

      return result
    },

    pageTitle() {
      return 'Оплата заказа'
    },

    actions() {

      const res = []

      if (this.step === 'start') {
        if (this.cardSid && !this.cardIsNew) {
          res.push({
            label: 'Оплатить с сохраненной карты',
            callback: this.onCheckoutAutopay,
            outline: false,
            loading: this.requestState.mutating
          })
        } else {
          res.push({
            label: 'Оплатить сейчас',
            callback: this.onCheckout,
            outline: false,
            loading: this.requestState.mutating
          })
        }
      }

      return res
    },

    payment() {
      return this.entity && this.entity.PAYMENTS.find(item => this.paymentId ? item.ID === parseInt(this.paymentId) : !item.IS_PAID)
    },

    propsByCode() {
      return this.entity.PROPS.reduce((map, item) => {
        map[item.CODE] = item
        return map
      }, {});
    },

    cardName() {
      if (this.cardIsNew) {
        return 'новой картой'
      } else {
        let card = this.$store.getters['sale_pub/userPaymentCardsBySid'][this.cardSid]
        if (card) return card['NAME']
      }
    },

    cardIsNew() {
      return this.cardSid === 'new'
    }

  },
  async mounted() {

    await this.$util.dom.scriptLoad("https://yookassa.ru/checkout-widget/v1/checkout-widget.js")

    await this.fetch()
  },
  methods: {

    async onCheckoutAutopay() {

      try {

        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/checkoutSaved.gql'),
          variables: {
            orderId: this.entityIdState,
            paymentId: parseInt(this.paymentId),
            cardSid: this.cardSid
          },
          state: this.requestState
        })

        if (this.onSuccess)
          this.onSuccess()

        this.visible = false

      } catch (e) {
        console.log(e)
      }

    },

    async onCheckout() {

      try {

        this.psData = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/checkout.gql'),
          variables: {
            orderId: this.entityIdState,
            paymentId: parseInt(this.paymentId),
            autopayAllow: this.autopayAllow
          },
          state: this.requestState
        })

        await this.renderWidget()

      } catch (e) {
        console.log(e)
      }

    },

    async renderWidget() {

      this.step = 'widget'

      this.$nextTick(() => {
        const checkout = new window.YooMoneyCheckoutWidget({
          confirmation_token: 'ct-' + this.psData.PS_INVOICE_ID,
          return_url: this.psData.PS_RETURN_URL,
          error_callback: function (error) {
            console.log(error)
          }
        });

        checkout.render('yookassa-widget');
      })
    },

    async fetch() {

      try {
        const entity = await this.$store.dispatch('sale_pub/userOrderFetch', {
          id: this.entityIdState,
          options: {
            state: this.requestState,
            setFetched: false
          }
        })

        this.assignEntity(entity, this.requestState)

        this.cardSid = this.prepareCardSid(this.propsByCode.ONLINE_PAYMENT_CARD_ID.VALUE)
      } catch (e) {
        console.log(e)
      }
    },

    prepareCardSid(cardSid) {
      return cardSid === 'new' || this.$store.getters['sale_pub/userPaymentCardsBySid'][cardSid] ? cardSid : null
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
