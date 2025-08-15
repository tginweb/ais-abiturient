<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="pageTitle"
      dialogWidth="550px"
      @hide="onHide"
  >

    <div v-if="step==='start'">

      <div class="q-mb-md">
        Для использования онлайн-оплаты заказа добавьте свою карту для последующих платежей.
      </div>

      <div class="q-mb-md text-weight-bold s-font-md">Для чего добавлять карту?</div>

      <ul>
        <li>Стоимость заказа может измениться в результате взвешивания весовых товаров или при замене товаров заказа.
        </li>
        <li>Удобство и скорость оплаты: нет необходииости переходить в итерфейс платежной системы</li>
      </ul>

      <div class="q-mt-md s-font-sm text-weight-bold">
        После авторизации карты с вашей карты будет списан 1 руб, который мы вернем автоматически.
      </div>

    </div>

    <div v-else-if="step==='widget'">

      <div id="yookassa-widget">

      </div>

    </div>


  </component>

</template>

<script>
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  components: {},
  props: {
    onSuccess: {},
    returnUrl: {},
    contextName: {},
    contextParams: {default: () => ({})},
    contextResultCallback: {},
  },
  data() {
    return {
      comment: null,
      psData: {},
      valueState: null,
      autopayAllow: true,
      step: 'start',
      orderId: {},
      orderHash: {},
      paymentId: {},

      authPayment: {}
    }
  },
  computed: {

    pageTitle() {
      return 'Добавление способа оплаты'
    },

    actions() {

      const res = []

      if (this.step === 'start') {

        res.push({
          label: 'Добавить карту оплаты',
          callback: this.onCheckout,
          outline: false,
          loading: this.requestState.mutating
        })

        if (this.contextName === 'order-make' && !this.requestState.mutating) {
          res.push({
            label: 'сменить на оплату при получении',
            callback: () => {
              this.onHide()
              this.contextResultCallback('to-cash', this.contextName, this.contextParams)
            },
            outline: true,
          })
        }
      }

      return res
    },

  },
  async mounted() {
    await this.$util.dom.scriptLoad("https://yookassa.ru/checkout-widget/v1/checkout-widget.js")
  },
  methods: {

    async onCheckout() {

      try {
        this.psData = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/checkoutAuth.gql'),
          variables: {
            contextName: this.contextName,
            contextParams: this.contextParams
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
          confirmation_token: 'ct-' + this.psData.PS_INVOICE_ID, //Токен, который перед проведением оплаты нужно получить от ЮKassa
          return_url: this.returnUrl || this.psData.PS_RETURN_URL, //Ссылка на страницу завершения оплаты, это может быть любая ваша страница

          //При необходимости можно изменить цвета виджета, подробные настройки см. в документации
          //customization: {
          //Настройка цветовой схемы, минимум один параметр, значения цветов в HEX
          //colors: {
          //Цвет акцентных элементов: кнопка Заплатить, выбранные переключатели, опции и текстовые поля
          //controlPrimary: '#00BF96', //Значение цвета в HEX

          //Цвет платежной формы и ее элементов
          //background: '#F2F3F5' //Значение цвета в HEX
          //}
          //},
          error_callback: function (error) {
            console.log(error)
          }
        });

        //Отображение платежной формы в контейнере
        checkout.render('yookassa-widget');
      })
    },

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
