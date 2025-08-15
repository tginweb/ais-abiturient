<template>

  <q-form ref="form" class="">

    <Prop
        :prop="propsByCode.ROUTE_LENGTH"
    />

    <div class="row q-col-gutter-md " v-if="allowPersonTypeChange || personType.IS_COMPANY">

      <div class="col-24 col-md-12" v-if="allowPersonTypeChange">

        <q-select
            v-model="fieldsState.PERSON_TYPE_ID"
            :options="personTypes"
            label="Тип профиля адреса"
            map-options
            emit-value
            optionLabel="NAME"
            optionValue="ID"
            outlined
            class="q-mb-md"
            v-if="personTypes && personTypes.length > 1 || true"
        />

      </div>
      <div class="col-24 col-md-12" v-if="personType.IS_COMPANY">


        <q-select
            label="Адрес для юр. лица"
            :value="propsByCode.COMPANY_ID.VALUE"
            @input="setPropValue('COMPANY_ID', $event)"
            :options="buyerCompanies"
            map-options
            emit-value
            optionLabel="NAME"
            optionValue="ID"
            outlined
            class="q-mb-md"
            :rules="[
              val => !!val || 'Не выбрана компания'
            ]"
            v-if="buyerCompanies.length"
        />

      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">

      <div class="col-24" v-if="deliveryZone">
        Зона доставки: {{ deliveryZone.NAME }}
      </div>

      <Prop
          :loading="deliveryCalc.fetching"
          :prop="propsByCode.ADDRESS"
          class="col-24"
          @change="onAddressChanged"
      >
        <template v-slot:append>
          <q-btn
              :icon="$icons.fasMapMarkerAlt"
              class="q-px-none full-width-lt-sm full-width "
              :label="$q.screen.gt.sm ? 'карта' : ''"
              text-color="primary"
              unelevated
              dense
              @click.prevent.stop="onMapOpen"
          />
        </template>
      </Prop>

      <template v-if="false">
        <div v-if="deliveryCalc.fetching" class="col-24 text-actions-orange q-py-sm">
          подождите, идет рассчет расстояния доставки...
        </div>
        <div v-else-if="propsByCode.ADDRESS.VALUE && !propsByCode.ROUTE_LENGTH.VALUE" class="col-24 text-red q-py-sm">

          <div>
            не определено расстояние доставки,
            исправьте адрес или
          </div>

          <q-btn
              label="повторите расчет"
              outline
              dense
              color="red"
              class="q-mt-sm"
              @click="onDeliveryCalc"
          />

        </div>
      </template>

    </div>

    <div
        class="row q-col-gutter-md q-col-gutter-xl-md q-pb-md q-pt-sm no-wrap1"
        :class="{
            'q-mb-lg-lg': propsByCode.PRIVATE_HOUSE.VALUE !== 'Y',
          }"
    >

      <template v-if="!propsByCode.PRIVATE_HOUSE || propsByCode.PRIVATE_HOUSE.VALUE === 'N'">

        <Prop
            :prop="propsByCode.PARAD"
            class="col-8 col-sm-8 col-md-8 col-lg-5 col-xl-5"
        />

        <Prop
            :prop="propsByCode.FLAT"
            class="col-8 col-sm-10 col-md-8 col-lg-5 col-xl-5"
            :label="$q.screen.gt.md ? 'Квартира / офис' : 'Кварт / офис'"
            :lazy-rules="true"
        />

        <Prop
            :prop="propsByCode.FLOOR"
            class="col-8 col-sm-6 col-md-8 col-lg-4"
        />

        <Prop
            :prop="propsByCode.LIFT"
            class="col-auto col-md-6 col-lg-4"
        />

      </template>

      <Prop
          :prop="propsByCode.PRIVATE_HOUSE"
          :class="{
            'col-auto col-md-9 col-lg-6': propsByCode.PRIVATE_HOUSE.VALUE !== 'Y',
            'col-24': propsByCode.PRIVATE_HOUSE.VALUE === 'Y'
          }"
      />

    </div>

    <div
        class="row q-col-gutter-md q-mb-md"
        v-if="propsByCode.RECEIVER_ANOTHER"
    >

      <Prop
          :prop="propsByCode.RECEIVER_ANOTHER"
          class="col-24"
      />

      <template v-if="propsByCode.RECEIVER_ANOTHER.VALUE === 'Y'">

        <Prop
            :prop="propsByCode.RECEIVER_NAME"
            class="col-24 col-md-12"
        />

        <Prop
            :prop="propsByCode.RECEIVER_PHONE"
            class="col-24 col-md-12"
        />

      </template>

    </div>

  </q-form>

</template>

<script>

import PropsGroup from "../prop/group/group.profile"
import PropsGroups from "../prop/groups/groups"
import Props from "../prop/list/list.edit"

import Prop from "@tgin/sale/core/component/order/prop/field/prop"
import * as propComponents from '@tgin/sale/core/component/order/prop/field'

export default {
  components: {
    Props,
    Prop,
    PropsGroup,
    PropsGroups,

  },
  props: {
    entity: {},
    action: {},
    context: {default: () => ({})},
    canDelete: {default: true},
    actions: {},
    personTypeId: {},
    allowPersonTypeChange: {}
  },
  provide() {
    return {
      onMapResult: this.onMapResult,
      bindPropInput: this.bindPropInput,
      onPropInput: this.onPropInput,
      onPropChange: this.onPropChange,
      onPropChangeMultiple: this.onPropChangeMultiple,
      propsUpdate: this.propsUpdate,
      propsUpdateByRole: this.propsUpdateByRole,
      propIf: this.propIf,
      propByRole: () => this.propByRole,
      date: {}
    }
  },
  data() {
    return {
      propsState: {},
      fieldsState: {
        PERSON_TYPE_ID: null,
        NAME: null
      },
      lastMapResult: null,
      map: {
        opened: false,
      },
      deliveryCalc: {
        called: false,
        fetching: false,
        result: null
      },
      deliveryZone: null,
    }
  },
  async mounted() {
    //this.$emit('update:actions', this.actionsComp)
  },
  created() {
    this.loadStateFromProfile()
  },
  watch: {

    'propsByCode.ZONE.VALUE': {
      async handler(zoneId) {
        if (zoneId)
          this.deliveryZone = await this.$store.dispatch('sale/findDeliveryZone', zoneId)
      },
    },

    actionsComp: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        this.$emit('update:actions', this.actionsComp)
      },
    },

  },
  computed: {
    buyerCompanies() {
      return this.entity.COMPANIES
    },
    personType() {
      return this.entity.PERSON_TYPE
    },
    personTypes() {
      return this.entity.PERSON_TYPES
    },
    actionsComp() {
      const result = [];

      if (this.entity) {

        if (this.action === 'edit') {

          result.push({
            label: 'Сохранить',
            color: 'primary',
            textColor: 'white',
            width: this.canDelete ? 'col-16' : 'col-24',
            disable: this.deliveryCalc.fetching || !this.propsByCode.ROUTE_LENGTH.VALUE,
            callback: () => {
              setTimeout(() => {
                this.onSave()
              }, 300)
            }
          })

          if (this.canDelete) {
            result.push({
              label: 'Удалить',
              color: 'primary',
              outline: true,
              disable: this.deliveryCalc.fetching,
              width: 'col-8',
              callback: () => {
                this.onDeleteConfirm()
              }
            })
          }

        } else {

          result.push({
            label: 'Сохранить',
            color: 'primary',
            textColor: 'white',
            disabled: this.deliveryCalc.fetching,
            width: 'col-24',
            callback: () => {
              setTimeout(() => {
                this.onSave()
              }, 300)
            }
          })
        }
      }

      return result
    },

    props() {
      return this.entity.PROPS.map(prop => {
        const res = {
          ...prop,
          VALUE: this.propsState[prop.ID]
        }
        return res
      })
    },

    propByRole() {
      return this.props.reduce((map, item) => {
        map[item.ROLE] = item
        return map
      }, {}) || {}
    },

    propsById() {
      return this.props.reduce((map, item) => {
        map[item.ID] = item
        return map
      }, {}) || {}
    },

    propsByCode() {
      return this.props.reduce((map, item) => {
        map[item.CODE] = item
        return map
      }, {}) || {}
    },

  },
  methods: {

    loadStateFromProfile() {

      this.propsState = this.entity.PROPS.reduce((map, prop) => {
        map[prop.ID] = prop.VALUE
        return map
      }, {})

      this.fieldsState = {
        PERSON_TYPE_ID: this.entity.PERSON_TYPE_ID
      }

    },

    propsUpdate(propsValues, by) {
      for (const [propRole, propValue] of Object.entries(propsValues)) {
        const prop = this.getProp(propRole)
        if (prop)
          prop.VALUE = propValue
      }
    },

    onAddressChanged() {
      console.log('onAddressChanged')
      this.propsByCode.ROUTE_LENGTH.VALUE = null
      this.onDeliveryCalc()
    },

    async onDeliveryCalc() {
      let address = this.propsByCode.ADDRESS.VALUE

      this.deliveryCalc.fetching = true

      try {

        if (address) {
          const res = await deliveryDispatcher.find(address, this.context.orderPrice)
          this.onDeliveryCalcResult(res)
        } else {
          this.onPropChangeMultiple({
            ZONE: 'MAIN',
            ADDRESS: '',
            ROUTE_LENGTH: 0,
          })
        }

      } catch (e) {
        console.log(e)
      }

      this.deliveryCalc.fetching = false
    },

    onMapOpen() {
      this.$router.push({
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

        console.log('onDeliveryCalcResult')
        console.log(res)

        this.deliveryCalc.called = true
        this.deliveryCalc.result = res

        this.onPropChangeMultiple({
          ZONE: res.inzone ? 'MAIN' : 'OUT',
          ADDRESS: res.to,
          ROUTE_LENGTH: res.routeLength,
        })
      }
    },

    propIf(p) {

      const prop = this.getProp(p)

      if (!prop)
        return false

      if (!prop.IF) {
        return true
      }

      const res = eval(prop.IF);

      return res
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
        res.label = com.label || prop.PROP.NAME
        res.hint = com.hint || prop.PROP.HINT
        res.lazyRules = com.lazyRules || false
        res.is = prop.PROP.COMPONENT_NAMES.find((name) => !!propComponents[name])
        res.options = prop.PROP.OPTIONS
        res.readonly = com.readonly || prop.IS_READONLY
        res.outlined = true
      }

      return res
    },

    onPropInput(propId, value) {

    },

    setPropValue(propId, value) {
      const prop = this.getProp(propId)
      if (prop) {
        this.$set(this.propsState, prop.ID, value)
      }
    },

    onPropChange(propId, value) {
      this.setPropValue(propId, value)
    },

    onPropChangeMultiple(props) {
      for (const [propId, propValue] of Object.entries(props)) {
        this.setPropValue(propId, propValue)
      }
    },

    propsUpdateByRole(propsValues) {
      for (const [propRole, propValue] of Object.entries(propsValues)) {
        const prop = this.propByRole[propRole]
        this.setPropValue(prop.ID, propValue)
      }
    },

    async onDeleteConfirm() {
      this.$q.dialog({
        title: 'Удаление',
        message: 'Вы действительно хотите удалить профиль?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.onDelete()
      })
    },

    async onDelete() {

      try {

        await this.$store.dispatch('gql/mutation', {
          mutation: require('@tgin/sale/pub/gql/profile/mutation/profile_delete.gql'),
          variables: {
            ID: this.profileState.ID
          }
        })

        this.$emit('saved')

      } catch (e) {
        console.log(e)
      }

    },

    async onSave() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            const profile = this.profileState

            const vars = {
              fields: this.fieldsState,
              props: this.propsState
            }

            if (this.action !== 'create') {
              vars.id = this.entity.ID
            }

            this.$store.dispatch('gql/mutation', {
              mutation: require('@tgin/sale/pub/gql/profile/mutation/profile_save.gql'),
              variables: vars
            })

            this.$emit('saved')

          } catch (e) {
            console.log(e)
          }
        }
      })
    }
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

.c-summary {
  border: 1px solid #ddd;

  .c-summary__info {
    border-bottom: 1px solid #ddd;
  }

  .c-summary__freedeliver {
    border-bottom: 1px solid #ddd;
  }
}


</style>
