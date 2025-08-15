<template>
  <div
      :class="{
      'mobile-bg relative-position': true,
      container: $q.screen.gt.sm
    }"
  >
    HOOk
  </div>
</template>

<script>

import PropsGroup from "../prop/group/group.order"
import PropsGroups from "../prop/groups/groups"
import Props from "../prop/list/list.edit"
import Profiles from "../profile/list.order"

import Prop from "@tgin/sale/core/component/order/prop/field/prop"

import * as propComponents from '@tgin/sale/core/component/order/prop/field'

export default {
  components: {
    Props,
    Prop,
    PropsGroup,
    PropsGroups,
    Profiles,
  },
  props: {
    allowFastorder: {default: true},
    ergonomic: {default: true},
    order: {},
    form: {},
    basket: {},
  },
  provide() {

    const date = {}

    Object.defineProperty(date, 'value', {
      enumerable: true,
      get: () => this.date,
    })

    return {
      bindPropInput: this.bindPropInput,
      onPropInput: this.onPropInput,
      onPropChange: this.onPropChange,
      onPropChangeMultiple: this.onPropChangeMultiple,

      propsUpdateByRole: this.propsUpdateByRole,
      propsUpdate: this.propsUpdate,

      propIf: this.propIf,
      orderOp: this.orderOp,
      propByRole: () => this.propByRole,
      order: () => this.order,
      date: date,

      onFieldChange: this.onFieldChange,
      onProfileSaved: this.onProfileSaved,
      onLogin: this.onLogin,
      onUserEdit: this.onUserEdit,
      onMapOpen: this.onMapOpen,
      onSubmit: this.onSubmit,
      onDeliveryCalc: this.onDeliveryCalc
    }
  },
  data() {
    return {
      ergonomicState: this.ergonomic,
      showingVesTooltip: false,
      phone: null,
      date: null,

      orderFields: {},
      orderProps: [],
      updatedFromState: false,

      updateForm: false,

      page: {
        title: 'Оформление заказа'
      },
      excludeProps: ['LOCATION'],
      groupsState: {},

      deliveryCalc: {
        called: false,
        fetching: false,
        result: null
      },

      promocode: {
        value: null,
        input: null,
        enable: false,
        error: false,
      },

      opShowFetching: false,
      opShowUpdating: false,

      opRequest: {
        op: null,
        result: null
      },

      fieldUserDescription: null,

      debouncePropsTimeout: 3000,
      debouncePropsTimeoutDefault: 3000,

      debounceFieldsTimeout: 100,
      debounceFieldsTimeoutDefault: 100,

      deliveryZone: null,

      validated: false
    }
  },
  async created() {
    this.updateFromState()

    this.$bus.on('user:auth', this.onUserAuth);
  },
  beforeDestroy() {
    this.$bus.off('user:auth', this.onUserAuth);
  },
  watch: {
    orderProps: {
      handler: function (data) {
        if (this.updatedFromState) return
        this.orderUpdatePropsDebounced()
      },
      deep: true
    },
    orderFields: {
      handler: function (data) {
        if (this.updatedFromState) return
        this.orderUpdateFieldsDebounced()
      },
      deep: true
    },
    deliveryPricePropsHash() {
      if (this.updatedFromState) return
      this.opShowFetching = true
    },
    'propsByCode.ADDRESS.VALUE'(val) {
      if (this.updatedFromState) return
      if (val) this.onDeliveryCalc()
    },
    'propsByCode.ZONE.VALUE': {
      immediate: true,
      deep: true,
      handler(zoneId) {
        this.onAddressDeliveryZoneChange(zoneId)
      },
    },
    'promocode.input'(val) {
      this.promocode.error = false
    },
  },
  computed: {

    messagesHaveErrors() {
      return !!this.messages.find(item => item.type === 'error')
    },
    messages() {
      const res = this.form.STATE.messages
      return res
    },
    profileId: {
      get: function () {
        return this.propsByCode.PROFILE_ID && this.propsByCode.PROFILE_ID.VALUE
      },
      set: function (val) {
        this.onPropChange('PROFILE_ID', val, false)
      }
    },
    companyId: {
      get: function () {
        return this.propsByCode.COMPANY_ID && this.propsByCode.COMPANY_ID.VALUE
      },
      set: function (val) {
        this.onPropChange('COMPANY_ID', val, false)
      }
    },
    formLocked() {
      return this.opShowUpdating || this.deliveryCalc.fetching || this.personType.RESTRICTED
    },
    basketIsEmpty() {
      return !this.basket.COUNT
    },

    personTypes() {
      return this.form.PERSON_TYPES
    },
    personType() {
      return this.form.PERSON_TYPE
    },

    delivery() {
      return this.form.DELIVERY
    },

    paysystem() {
      return this.form.PAYSYSTEM
    },

    profiles() {
      return this.form.PROFILES
    },

    profile() {
      return this.form.PROFILE
    },

    companies() {
      return this.form.COMPANIES
    },

    company() {
      return this.form.COMPANY
    },

    paycards() {
      return this.form.PAYCARDS
    },

    orderDto() {
      return {
        PROPS: this.orderProps,
        FIELDS: this.orderFields,
      }
    },
    isOnlinePayment() {
      return this.paysystem && this.paysystem.SERVICE.IS_ONLINE && !this.paysystem.SERVICE.IS_ONLINE_DELAYED
    },
    submitButtonLabel() {
      if (this.isOnlinePayment) {
        return 'Оформить и оплатить заказ'
      } else {
        return 'Оформить заказ'
      }
    },
    groupEditedPersonal() {
      return true;
    },
    deliveryPricePropsHash() {
      return [
        this.propsByCode.ZONE ? this.propsByCode.ZONE.VALUE : '',
        this.propsByCode.ROUTE_LENGTH ? this.propsByCode.ROUTE_LENGTH.VALUE : '',
      ].join('-')
    },

    orderUpdatePropsDebounced() {
      return this.$util.base.debounce(this.orderUpdateProps, this.debouncePropsTimeout)
    },

    orderUpdateFieldsDebounced() {
      return this.$util.base.debounce(this.orderUpdateFields, this.debounceFieldsTimeout)
    },

    props() {
      return this.orderProps && this.orderProps.filter(prop => {
        return this.excludeProps.indexOf(prop.CODE) < 0 && this.excludeProps.indexOf(prop.ID) < 0
      }) || []
    },

    propByRole() {
      return this.props.reduce((map, item) => {
        map[item.PROP.ROLE] = item
        return map
      }, {}) || {}
    },

    propsById() {
      return this.props.reduce((map, item) => {
        map[item.ID] = item
        return map
      }, {}) || {}
    },

    propsValuesByCode() {
      return this.props.reduce((map, item) => {
        map[item.PROP.CODE] = item.VALUE
        return map
      }, {}) || {}
    },

    propsByCode() {
      return this.props.reduce((map, item) => {
        map[item.PROP.CODE] = item
        return map
      }, {}) || {}
    },

  },
  mounted() {
    const from = this.$route.query.from
  },
  methods: {
    scrollHandler(info) {
    },
    async onUserEdit() {
      await this.$router.push({name: 'user:profile.edit'})
    },
    async onAddressDeliveryZoneChange(zoneId) {
      this.deliveryZone = await this.$store.dispatch('sale/findDeliveryZone', zoneId)
    },
    async onUserAuth() {
      await this.orderOp('auth', {}, {updateForm: true})
    },
    async onSyncProfile() {
      await this.orderOp('profile-sync', {}, {updateForm: true})
    },
    async onLogin() {
      await this.$router.push({
        name: 'user:auth',
        params: {
          email: this.propsByCode.EMAIL ? this.$util.format.normalizeEmail(this.propsByCode.EMAIL.VALUE, true) : null,
          phone: this.propsByCode.PHONE ? this.$util.format.normalizePhone(this.propsByCode.PHONE.VALUE, true) : null,
          redirect: 'current-route',
          disableBasketTransfer: true
        }
      })
    },

    updateFromState() {
      this.updatedFromState = true

      this.orderProps = this.$util.base.cloneDeep(this.form.PROPS)
      this.orderFields = this.$util.base.cloneDeep(this.form.FIELDS)

      this.$nextTick(() => {
        //this.promocode.input = this.promocode.value = this.propsByCode.PROMO.VALUE
        //this.promocode.error = false
        this.updatedFromState = false
      })
    },

    async onProfileSaved(args) {
      let profileId

      if (args.op === 'created' || args.op === 'deleted') {
        if (args.op === 'created') {
          profileId = args.entityId
        } else {
          if (this.profiles.length) {
            profileId = this.profiles[0].ID
          } else {
            profileId = 0
          }
        }
        await this.orderOp('profile-change', {PROFILE_ID: profileId}, {updateForm: true});
      } else {
        await this.orderOp('profile-reload', {}, {updateForm: true})
      }
    },

    async onDeliveryCalc() {
      let address = this.propsByCode.ADDRESS.VALUE
      this.deliveryCalc.fetching = true
      try {
        const res = await deliveryDispatcher.find(address)
        this.onDeliveryCalcResult(res)
      } catch (e) {
        console.log(e)
      }
      this.deliveryCalc.fetching = false
    },

    async onMapOpen() {
      await this.$router.push({
        name: 'sale:address-map',
        params: {
          onDone: this.onDeliveryCalcResult,
          orderPrice: this.orderPrice,
          openAddress: this.propsByCode.ADDRESS.VALUE
        }
      })
    },

    onDeliveryCalcResult(res) {
      if (res.to) {
        this.deliveryCalc.called = true
        this.deliveryCalc.result = res
        this.opShowFetching = true
        this.onPropChangeMultiple({
          ZONE: res.inzone ? 'MAIN' : 'OUT',
          ADDRESS: res.to,
          ROUTE_LENGTH: res.routeLength,
        })
      }
    },

    onSubmit() {
      this.$nextTick(() => {
        setTimeout(this.onSubmitValidate, 70)
      })
    },

    async ensureDeliveryFields() {
      if (!this.propsByCode.ROUTE_LENGTH.VALUE && this.propsByCode.ADDRESS.VALUE) {
        this.updatedFromState = true
        try {
          await this.onDeliveryCalc()
        } catch (e) {
        }
        this.updatedFromState = false
      }
    },

    async onSubmitAction() {

      this.opShowUpdating = true

      try {
        await this.ensureDeliveryFields()
        const res = await this.orderOp('submit', {}, {updateForm: true})

        if (res.state.success) {

          this.opShowUpdating = true

          const orderId = res.payload.orderId
          const orderUrl = res.payload.orderUrl

          if (window.ym)
            ym(8821120, 'reachGoal', 'zakaz', {
              order_price: parseInt(orderPrice),
              currency: "RUB"
            });

          window.location.replace(orderUrl)
        }

      } catch (e) {
        console.log(e)
        this.opShowUpdating = false
      }
    },

    onSubmitValidate() {
      this.$refs.form.validate().then(async (success, t) => {
        if (success) {
          await this.onSubmitAction()
        } else {
          const errorElm = this.$refs.form.$el.querySelector('.q-field--error')
          if (errorElm) {
            if ([].indexOf.call(errorElm.classList, 'custom-field') > -1) {
              this.$util.dom.scrollTo({el: errorElm, offset: 80, duration: true})
            }
          }
        }
      })
    },

    async orderUpdateProps() {
      let updateForm = this.updateForm
      this.updateForm = false
      await this.orderOp('update-props', {}, {updateForm: updateForm})
      this.debouncePropsTimeout = this.debouncePropsTimeoutDefault
    },

    async orderUpdateFields() {
      await this.orderOp('update-fields', {}, {updateForm: true})
      this.debounceFieldsTimeout = this.debounceFieldsTimeoutDefault
    },

    async orderOp(op, params, {updateForm = false} = {}) {

      if (updateForm)
        this.opShowUpdating = true

      let res

      try {
        this.opRequest.op = op

        res = await this.$store.dispatch('sale_pub/vorderOp', {
          op: op,
          params: params || {},
          order: this.orderDto,
        })

        if (updateForm)
          this.updateFromState()

      } catch (e) {
      }

      this.opShowFetching = false
      this.opShowUpdating = false
      return res
    },

    propIf(p) {
      const prop = this.getProp(p)
      if (!prop) return false
      if (prop.IF) {
        const props = this.propsValuesByCode
        return eval(prop.IF);
      }
      return true
    },

    getProp(propId) {
      let prop
      if (typeof propId === 'string') {
        prop = this.propsByCode[propId]
      } else if (typeof propId === 'number') {
        prop = this.propsById[propId]
      } else {
        prop = propId
      }
      return prop
    },

    bindPropInput(propId, com) {
      const res = {}
      const prop = this.getProp(propId)

      if (prop) {
        res.label = com.label || prop.NAME
        res.lazyRules = com.lazyRules || false
        res.is = prop.PROP.COMPONENT_NAMES.find((name) => !!propComponents[name])
        res.options = prop.PROP.OPTIONS
      }

      return res
    },

    onFieldChange(field, value, timeout = null) {
      if (timeout)
        this.debounceFieldsTimeout = timeout

      this.orderFields[field] = value
    },

    onPropInput(propId, value, timeout = null) {

      const prop = this.getProp(propId)

      if (prop) {

        if (timeout === false)
          timeout = 1

        switch (prop.CODE) {
          case 'BONUSES':
            timeout = 3000
            this.updateForm = true
            break;
        }

        if (timeout) {
          this.debouncePropsTimeout = timeout
          prop.VALUE = value
        }
      }
    },

    onPropChange(propId, value, timeout = null) {
      const prop = this.getProp(propId)

      if (prop) {

        switch (prop.CODE) {
          case 'ONLINE_PAYMENT_CARD_ID':
          case 'BONUSES':
          case 'PROFILE_ID':
          case 'COMPANY_ID':
            this.updateForm = true
            break;
        }

        /*
        if (prop.CODE === 'ROUTE_LENGTH' || prop.CODE === 'ROUTE_LENGTH') {
          if (!this.lastMapResult || this.lastMapResult.to !== value) {

            //this.calcDeliveryPrice(value);
          }
        }
         */

        if (timeout)
          this.debouncePropsTimeout = timeout
        else if (timeout === false)
          this.debouncePropsTimeout = 1

        prop.VALUE = value
      }
    },

    onPropChangeMultiple(props) {
      for (const [propId, propValue] of Object.entries(props)) {
        //const prop = this.propsById[propId]
        const prop = this.getProp(propId)
        if (prop)
          prop.VALUE = propValue
      }
    },

    propsUpdateByRole(propsValues) {
      for (const [propRole, propValue] of Object.entries(propsValues)) {
        const prop = this.propByRole[propRole]
        if (prop)
          prop.VALUE = propValue
      }
    },

    propsUpdate(propsValues, by) {
      for (const [propRole, propValue] of Object.entries(propsValues)) {
        const prop = this.getProp(propRole)
        if (prop)
          prop.VALUE = propValue
      }
    },

  }
}
</script>

<style lang="scss" scoped>

.c-items {
  border: 1px solid #ddd;
}

.c-item {
  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
}


@media (min-width: $breakpoint-sm-max) {
  .--props-group-limit-width {
    /deep/ {
      .q-field {
        max-width: 248px;
      }
    }
  }
}


</style>
