
export default {
  props: {
    nav: {},
    polling: {},
    entityId: {},
    entityHash: {},
    entityData: {},
    contextView: {},
    actionsOutline: {},
    basketHide: {default: false},
    compact: {default: false}
  },
  data() {
    return {
      viewMode: null,
      entity: this.entityData,

      refetchEnable: false,
      refetchHandle: null,
      refetchInterval: 1000 * 20,

      actionProcess: false,

      state: {
        fetched: false,
        fetching: false,
      }
    }
  },
  computed: {

    orderAction() {
      return this.$route.query.action
    },

    pollingActive() {
      return !!this.refetchHandle
    },

    orderTitle() {
      return this.entity ? 'Заказ №' + this.entity.ACCOUNT_NUMBER + ' на ' + this.$util.format.price(this.entity.PRICE) : null
    },

    unpaidOnlinePayment() {
      return this.entity.PAYMENTS && this.entity.PAYMENTS.find(item => item.IS_ONLINE && !item.IS_PAID) || null
    },

    unpaidBillPayment() {
      return this.entity.PAYMENTS && this.entity.PAYMENTS.find(item => item.IS_BILL && !item.IS_PAID) || null
    },

    orderActions() {

      return [
        {
          color: 'primary',
          label: 'Оплатить',
          access: this.entity.IS_CAN_PAY_ONLINE || this.entity.IS_CAN_PAY_BILL,
          callback: this.onNavPay,
          position: 'fixed'
        },
        {
          color: 'primary-brown-1',
          textColor: 'dark',
          label: 'Детали',
          access: true,
          callback: this.onNav,
          position: 'fixed',
          viewMode: ['teaser']
        },
        {
          color: 'primary-brown-1',
          textColor: 'dark',
          label: 'Связаться',
          access: this.entity.IS_ACTIVE,
          callback: this.onNavContact,
          position: 'fixed'
        },
        {
          color: 'primary-brown-1',
          textColor: 'dark',
          label: 'Повторить',
          access: !this.entity.IS_ACTIVE,
          callback: this.onNavRepeat,
          position: 'fixed'
        },
        {
          color: 'primary-brown-1',
          textColor: 'dark',
          label: 'Оценить',
          access: !this.entity.IS_ACTIVE && !this.entity.IS_CANCELED,
          callback: this.onNavReview,
          position: 'fixed'
        },
        {
          color: 'primary-brown-1',
          textColor: 'actions-red',
          label: 'Отменить',
          access: this.entity.IS_ACTIVE && !this.entity.IS_PAID,
          callback: this.onNavCancel,
          position: 'fixed'
        },

      ]
    },

    orderActionsAccessible() {
      return this.entity ? this.orderActions.filter(item => item.access && (!item.viewMode || item.viewMode.indexOf(this.viewMode) > -1)) : []
    },

    fields() {
      const res = [];

      const datetime = [];

      if (this.propsByCode.DATE)
        datetime.push(this.propsByCode.DATE.VALUE_VIEW)

      if (this.propsByCode.TIME)
        datetime.push(this.propsByCode.TIME.VALUE_VIEW)

      let payment = this.entity.PAY_SYSTEM_NAME;

      //res.push({'NAME': 'Оплата', 'MARKUP': payment})
      res.push({'NAME': 'Доставка', 'VALUE': datetime.join(' ')})

      if (this.propsByCode.ADDRESS && this.propsByCode.ADDRESS.VALUE_VIEW)
        res.push({
          'NAME': 'Адрес доставки',
          'VALUES': [
            this.propsByCode.ADDRESS && this.propsByCode.ADDRESS.VALUE_VIEW,
            //this.propsByCode.PARAD && this.propsByCode.PARAD.VALUE_VIEW  ? 'парадная ' + this.propsByCode.PARAD.VALUE_VIEW : null,
            //this.propsByCode.FLAT && this.propsByCode.FLAT.VALUE_VIEW ? 'кв/офис ' + this.propsByCode.FLAT.VALUE_VIEW : null,
            //this.propsByCode.FLOOR && this.propsByCode.FLOOR.VALUE_VIEW ? 'этаж ' + this.propsByCode.FLOOR.VALUE_VIEW : null,
            //this.propsByCode.LIFT && this.propsByCode.LIFT.VALUE_VIEW == 'Y' ? 'есть лифт' : null,
          ]
        })

      res.push({
        'NAME': 'Получатель', 'VALUES': [
          this.propsByCode.FIO && this.propsByCode.FIO.VALUE_VIEW,
          this.propsByCode.PHONE && this.propsByCode.PHONE.VALUE_VIEW,
          this.propsByCode.EMAIL && this.propsByCode.EMAIL.VALUE_VIEW,
        ]
      })

      if (this.entity.USER_DESCRIPTION)
      res.push({
        'NAME': 'Комментарий', 'VALUES': [
          this.entity.USER_DESCRIPTION,
        ]
      })

      return res
    },

    propsByCode() {

      return this.entity.PROPS.reduce((map, item) => {
        map[item.CODE] = item
        return map
      }, {});
    },

    statuses() {

      let foundCurrent = false

      return this.$store.getters['sale/orderStatusesOrder'].filter(status => {

        let res = true

        if (status.ID === 'A') {
          res = this.entity.PAY_SYSTEM_IS_ONLINE
        }

        return res

      }).map((status) => {

        const extend = {}

        const orderStatusId = this.entity.CSTATUS_ID

        if (status.ID === orderStatusId) {
          foundCurrent = true
          extend.CURRENT = true
        }

        if (!foundCurrent) {
          extend.DONE = true
        }

        if (extend.DONE || extend.CURRENT) {
          extend.COLOR_STROKE = '#00AA00';
        } else {
          extend.COLOR_STROKE = '#AAAAAA';
        }

        extend.STROKE_WIDTH = 2;
        extend.COLOR_FILL = '#FFF';

        if (status.ID === 'N') {

          extend.STROKE_WIDTH = 1;

          if (extend.DONE || extend.CURRENT)
            extend.COLOR_FILL = '#00AA00';


        } else if (status.ID === 'A') {
          extend.COLOR_FILL = '#00AA00';
          if (extend.CURRENT) {
            extend.COLOR_FILL = '#f5bc2a';
            extend.COLOR_STROKE = '#f5bc2a';
          }
          if (this.entity.IS_PAID) {
            extend.NAME = 'Оплачен'
          }
        }

        return {
          ...status,
          ...extend
        }
      })
    }
  },
  watch: {
    entityData(val) {
      this.entity = val
    },
    entity(val) {
      this.refetchStart()
    },
    'entity.IS_ACTIVE'(val) {
      if (!val)
        this.refetchStop()
    }
  },
  beforeDestroy() {
    this.refetchStop()
  },
  async created() {

    if (!this.entity) {
      await this.fetch()
    }
    this.refetchStart()

    if (this.actionProcess && this.orderAction) {
      this.doAction(this.orderAction)
    }

  },
  methods: {

    doAction(action) {
      switch (action) {
        case 'pay-initiate':
          this.onNavPay()
          break
      }
    },

    refetchStart() {
      if (this.refetchEnable && this.entity && this.entity.IS_ACTIVE) {
        if (!this.refetchHandle) {
          this.refetchHandle = setInterval(() => {
            this.fetch(true)
          }, this.refetchInterval)
        }
      } else {
        this.refetchStop()
      }
    },

    refetchStop() {
      if (this.refetchHandle)
        clearInterval(this.refetchHandle)
      this.refetchHandle = null
    },

    async fetch(refetch) {
      const entityId = this.entityData ? this.entityData.ID : parseInt(this.entityId)

      if (!refetch && this.entityData) {
        this.entity = this.entityData
      } else {
        this.entity = await this.$store.dispatch('sale_pub/userOrderFetch', {
          id: entityId,
          hash: this.entityHash,
          options: {
            state: this.state,
          }
        })
      }
    },

    onNav() {
      this.$router.push({name: 'sale:order.view', params: {entityId: this.entity.ID}})
    },
    onNavContact() {
      this.$router.push({name: 'app:contacts'})
    },
    onNavCancel() {
      this.$router.push({
        name: 'sale:order.cancel',
        params: {
          entityId: this.entity.ID,
          onResolve: (v) => {
            this.fetch(true)
          }
        }
      })
    },
    onNavRepeat() {
      this.$router.push({
        name: 'sale:order.repeat',
        params: {
          entityId: this.entity.ID
        }
      })
    },
    onNavReview() {
      this.$router.push({
        name: 'review:order.add',
        params: {
          entityId: this.entity.ID,
          onResolve: (v) => {
            this.fetch(true)
          }
        }
      });
    },
    async onNavPay(paymentData) {

      let payCommand

      if (!this.entity.IS_CAN_PAY)
        return

      try {

        if (!paymentData) {

          let payment = paymentData || this.unpaidOnlinePayment || this.unpaidBillPayment

          const {data: {res: paymentData}} = await this.$apollo.query({
            query: require('@tgin/sale/pub/gql/order/query/pay.gql'),
            fetchPolicy: 'no-cache',
            variables: {
              id: this.entity.ID,
              hash: this.entityHash,
              paymentId: payment ? payment.ID : null,
            }
          })

          if (paymentData)
            payCommand = paymentData.PAY_NAV

        } else {
          payCommand = paymentData.PAY_NAV
        }

        console.log('TTT')

        console.log(paymentData)

        console.log(payCommand)

        if (payCommand) {
          if (payCommand.type === 'location') {
            window.location.replace(payCommand.path)
          } else {
            await this.$store.dispatch('command/run', payCommand)
          }
        }

      } catch (e) {
        console.log(e)
      }

    },

  }
}

