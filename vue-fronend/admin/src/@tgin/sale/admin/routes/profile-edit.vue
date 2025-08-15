<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :loadingLabel="loadingLabel"
      :title="'Профиль ' + entityId"
      dialog-width="1150px"
      :toolbar="entity && entity.ACTIONS"
      @hide="onHide"
  >
    <template v-slot:default="{entity}">

      <q-form ref="form">


        <div class="row q-col-gutter-lg q-mb-lg">
          <div class="col-12">
            <ui-admin-data-card
                title="Профиль"
            >
              <q-input
                v-model="entityState.NAME"
                outlined
                label="Наименование"
              />
            </ui-admin-data-card>
          </div>
          <div class="col-12">
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div
              class="col-md-12 q-gutter-y-lg"
              v-for="(groups, index) of propsGroupsChunks"
              :key="index"
          >
            <ui-admin-data-card
                v-for="group of groups"
                :key="group.ID"
                :title="group.NAME"
            >
              <div
                  v-for="prop of group.PROPS"
                  :key="prop.ID"
              >
                <Prop
                    :prop="prop"
                    class="q-mb-md"
                />
              </div>
            </ui-admin-data-card>
          </div>

        </div>
      </q-form>

    </template>
  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import PropsGroup from "@tgin/sale/pub/component/order/prop/group/group.profile"
import PropsGroups from "@tgin/sale/pub/component/order/prop/groups/groups"
import Props from "@tgin/sale/pub/component/order/prop/list/list.edit"
import Prop from "@tgin/sale/core/component/order/prop/field/prop"
import * as propComponents from "@tgin/sale/core/component/order/prop/field";

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {
    Props,
    Prop,
    PropsGroup,
    PropsGroups,
  },
  data() {
    return {
      modeId: 'common',
      deliveryCalc: {
        called: false,
        fetching: false,
        result: null
      },
      loadingLabel: ''
    }
  },
  provide() {
    return {
      onMapResult: this.onMapResult,
      bindPropInput: this.bindPropInput,
      onPropInput: this.onPropInput,
      onPropChange: this.onPropChange,
      onPropChangeMultiple: this.onPropChangeMultiple,
      propsUpdateByRole: this.propsUpdateByRole,
      propIf: this.propIf,
      propByRole: () => this.propByRole,
      date: {}
    }
  },
  computed: {

    propsVals() {
      const profile = this.entityState

      const vars = {
        name: profile.NAME,
        props: profile.PROPS.reduce((map, item) => {
          map[item.PROP_ID] = item.VALUE
          return map
        }, {})
      }

      vars.id = this.entityState.ID
      return vars
    },

    propsGroupsChunks() {
      return this.$util.base.chunkArray(this.propsGroups, 2)
    },

    props() {
      return this.entity && this.entity.PROPS.filter(prop => {
        return true
      }).map(prop => {
        const cprop = {
          ...prop,
        }
        return cprop
      }) || []
    },

    propsByCode() {
      return this.props.reduce((map, item) => {
        map[item.CODE] = item
        return map
      }, {}) || {}
    },

    propsById() {
      return this.props.reduce((map, item) => {
        map[item.PROP_ID] = item
        return map
      }, {}) || {}
    },

    propByRole() {
      return this.props.reduce((map, item) => {
        map[item.ROLE] = item
        return map
      }, {}) || {}
    },

    propsByGroupId() {
      return this.props.reduce((map, item) => {
        if (!map[item.GROUP_ID])
          map[item.GROUP_ID] = []
        map[item.GROUP_ID].push(item)
        return map
      }, {}) || {}
    },

    propsGroups() {
      return this.$store.state.sale.app.orderPropGroups.map((group) => {
        const props = (this.propsByGroupId[group.ID] || [])
            .filter(prop => {
              if (!this.isJuridical && /^COMPANY\_/i.test(prop.CODE)) {
                return false
              }
              return true
            })
        return {
          ...group,
          PROPS: props
        }
      }).filter(group => !!group.PROPS.length)
    },

    actions() {
      return [
        {
          label: 'Сохранить',
          callback: this.onSubmit,
          loading: this.requestState.mutating
        },
      ]
    },

    isJuridical() {
      return this.propsByCode.IS_COMPANY && this.propsByCode.IS_COMPANY.VALUE === 'Y'
    },

  },
  created() {
    this.fetch()
  },

  methods: {
    async onSubmit() {
      try {
        if (await this.$refs.form.validate())
          await this.onSubmitCommit()
      } catch (e) {
      }
    },
    async onSubmitCommit() {
      try {
        const profile = this.entityState

        const vars = {
          name: this.entityState.NAME,
          props: profile.PROPS.reduce((map, item) => {
            map[item.PROP_ID] = item.VALUE
            return map
          }, {})
        }

        if (this.action !== 'create') {
          vars.id = this.entityState.ID
        }

        await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/profile/mutation/save.gql'),
          variables: vars,
          state: this.requestState
        })

        this.onResolve && this.onResolve()
        this.visible = false
      } catch (e) {
        console.log(e)
      }
    },

    async onDeliveryCalc() {
      let address = this.propsByCode.ADDRESS.VALUE

      this.deliveryCalc.fetching = true
      this.requestState.fetching = true
      this.loadingLabel = 'Рассчет расстояния'

      try {
        const res = await deliveryDispatcher.find(address)

        this.onDeliveryCalcResult(res)

      } catch (e) {
        console.log(e)
      }

      this.deliveryCalc.fetching = false
      this.requestState.fetching = false
      this.loadingLabel = ''

    },

    onMapOpen() {
      this.$store.dispatch('router/vrouterPush', {
        is: 'sale-address-map',
        props: {
          onDone: this.onDeliveryCalcResult,
          openAddress: this.propsByCode.ADDRESS.VALUE
        }
      })
    },

    onDeliveryCalcResult(res) {

      if (res.to) {
        this.deliveryCalc.called = true
        this.deliveryCalc.result = res

        this.setPropValueMultiple({
          ZONE: res.inzone ? 'MAIN' : 'OUT',
          ADDRESS: res.to,
          ROUTE_LENGTH: res.routeLength,
        }, 'delivery')

      }
    },

    propIf(p) {

      const prop = this.getProp(p)

      if (!prop.IF) {
        return true
      }

      const res = eval(prop.IF);

      return res
    },

    propsSelect(props) {
      return props.map(propId => this.getProp(propId)).filter(item => !!item)
    },

    getPropsGroups(ids = []) {
      return ids.map(id => this.propsGroupsDataById[id]).filter(item => !!item)
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

    bindPropInput(propId, modeView) {
      const res = {}
      const prop = this.getProp(propId)

      if (prop) {
        res.label = prop.NAME
        res.is = prop.COMPONENT_NAMES.find((name) => !!propComponents[name])
        res.options = prop.OPTIONS
        res.modeView = modeView
      }
      return res
    },

    onPropInput(propId, value) {

    },

    setPropValueMultiple(props, context = null) {
      for (const [propId, propValue] of Object.entries(props)) {
        this.setPropValue(propId, propValue, context)
      }
    },

    setPropValue(propId, value, context = null) {

      const prop = this.getProp(propId)

      let profileProp = this.entityState.PROPS.find(item => item.ID === prop.ID)

      if (!profileProp) {
        profileProp = {
          PROP_ID: prop.ID,
          ID: prop.ID,
        }
        this.entityState.PROPS.push(profileProp)
      }

      this.$set(profileProp, 'VALUE', value)

      if (!context) {
        switch (prop.CODE) {
          case 'ADDRESS':
            this.onDeliveryCalc()
            break;
        }
      }
    },

    onPropChange(propId, value) {
      this.setPropValue(propId, value)
    },

    onPropChangeMultiple(props) {
      this.setPropValueMultiple(props)
    },

    propsUpdateByRole(propsValues) {
      for (const [propRole, propValue] of Object.entries(propsValues)) {
        const prop = this.propByRole[propRole]
        if (prop)
          prop.VALUE = propValue
      }
    },


    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_admin/profileFetch', {
          id: this.entityIdState,
          options: {
            state: this.requestState,
            setFetched: false
          }
        })
        this.assignEntity(entity, this.requestState)
      } catch (e) {
        console.log(e)
      }
    },

  },
  watch: {}
}

</script>

<style lang="scss" scoped>

.c-panel {
  border: 1px solid #ddd;
  padding: 14px;

  .c-panel__label {
    font-weight: bold;
    margin: 0 0 13px 0;
  }
}

.c-field {
  display: flex;

  &:not(:last-child) {
    margin-bottom: 10px;
    border-bottom: 1px dotted #EEE;
    padding-bottom: 10px;
  }

  .c-field__label {
    color: #777;
  }

  .c-field__value {
    margin-left: auto;
    text-align: right;
  }

}

</style>
