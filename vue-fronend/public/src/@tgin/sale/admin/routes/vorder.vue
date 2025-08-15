<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="'Вирт. заказ ' + entityId"
      dialog-width="1250px"
      @hide="onHide"
      :tabs="modesTabs"
      :tab.sync="modeId"
      :scroll-height.sync="scrollHeight"
  >

    <template v-slot:default="{entity}">

      <ui-data-source
          :data.sync="events"
          ref="dsEvents"
          v-if="modesUsed['events']"
      />

      <q-tab-panels v-model="modeId" animated>

        <q-tab-panel class="q-px-none" name="common">

          <div class="row q-col-gutter-lg q-mb-lg">
            <div class="col-md-12 q-gutter-lg">
              <ui-admin-data-card
                  title="Общие данные"
                  :fields="sectionCommon"
              />
            </div>
            <div class="col-md-12">
              <ui-admin-data-card
                  title="Поля"
                  :fields="sectionFields"
              />
            </div>
          </div>

          <div class="row q-col-gutter-lg">
            <div class="col-md-12 q-gutter-lg">
              <template v-if="propsGroupsChunks[0]">
                <ui-admin-data-card
                    v-for="group of propsGroupsChunks[0]"
                    :key="group.ID"
                    :title="group.NAME"
                    :fields="group.FIELDS"
                />
              </template>
            </div>
            <div class="col-md-12">
              <template v-if="propsGroupsChunks[1]">
                <ui-admin-data-card
                    v-for="group of propsGroupsChunks[1]"
                    :key="group.ID"
                    :title="group.NAME"
                    :fields="group.FIELDS"
                />
              </template>
            </div>
          </div>


        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="logger">

          <ui-data-panel
              :data="events"
              ref="orders"
              :filters-enable="true"
          />

        </q-tab-panel>

      </q-tab-panels>

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import CTableEvents from '@tgin/logger/admin/component/event/list/table'

export default {
  mixins: [MVroute],
  components: {

  },
  props: {
    onResolve: {},
  },
  data() {
    return {
      modeId: 'common',
      events: {
        table: {
          height: 'calc(100vh - 200px)',
          com: CTableEvents
        },
        recordsetQuery: () => require('@tgin/logger/admin/gql/event/query/recordset.gql'),
        filterQuery: () => require('@tgin/logger/admin/gql/event/query/filters.gql'),
        filterSchema: [],
        filter: {
          vorderId: {eq: parseInt(this.entityId)}
        },
        where: {
        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'created',
          limit: 10
        },
        status: {
          loaded: false,
          loading: false,
        },
      },
    }
  },
  computed: {
    modes() {
      if (!this.entity)
        return []

      return [
        {
          id: 'common',
          label: 'Общее',
          type: 'tab',
          actions: () => {

          }
        },
        {
          id: 'logger',
          label: 'Лог',
          type: 'tab',
          actions: () => {
            return []
          }
        },
      ]
    },

    isJuridical() {
      return this.propsByCode.IS_COMPANY && this.propsByCode.IS_COMPANY.VALUE === 'Y'
    },

    isPrivateHouse() {
      return this.propsByCode.PRIVATE_HOUSE && this.propsByCode.PRIVATE_HOUSE.VALUE === 'Y'
    },

    propsGroupsChunks() {
      return this.$util.base.chunkArray(this.propsGroups, 2)
    },

    propsGroups() {
      return this.$store.state.sale.app.orderPropGroups.map((group) => {
        const fields = (this.propsByGroupId[group.ID] || [])
            .filter(prop => {

              if (
                  !this.isJuridical && /^COMPANY\_/i.test(prop.CODE) ||
                  this.isPrivateHouse && (['FLAT', 'FLOOR', 'LIFT', 'PARAD'].indexOf(prop.CODE) > -1)
              )
                return false;

              return !!prop.VALUE_VIEW
            })
            .map(prop => {
              const cprop = {
                label: prop.NAME,
                value: prop.VALUE_VIEW
              }
              return cprop
            })
        return {
          ...group,
          FIELDS: fields
        }
      }) || []
    },

    props() {
      return this.entity && this.entity.PROPS ? this.entity.PROPS : []
    },

    propsByCode() {
      return this.props.reduce((map, obj) => (map[obj.CODE] = obj, map), {})
    },

    propsByGroupId() {
      return this.props.reduce((map, item) => {
        if (!map[item.GROUP_ID])
          map[item.GROUP_ID] = []
        map[item.GROUP_ID].push(item)
        return map
      }, {}) || {}
    },

    sectionCommon() {

      const result = []

      result.push({
        label: 'ID',
        value: this.entity.ID,
      })

      result.push({
        label: 'Пользователь',
        value: this.entity.USER.NAME_FULL + ' [' + this.entity.USER.ID + ']',
        to: '/admin/user/' + this.entity.USER.ID
      })

      result.push({
        label: 'ID покуптеля',
        value: this.entity.FUSER_ID,
      })

      result.push({
        label: 'ID сессия',
        value: this.entity.SESSION_ID,
      })

      result.push({
        label: 'Реальный заказ',
        value: this.entity.ORDER ? this.entity.ORDER.ACCOUNT_NUMBER + '/' + this.entity.ORDER.ID + '<br>[' + this.entity.ORDER.STATUS_NAME + ']' : '',
        to: {name: 'sale:order.view', params: {entityId: this.entity.ORDER_ID}}
      })

      return result
    },

    sectionFields() {

      const result = []

      const deliveryService = this.$store.getters['sale/deliveryServicesById'][this.entity.FIELDS.DELIVERY_SERVICE_ID]
      const paysystem = this.$store.getters['sale/paysystemsById'][this.entity.FIELDS.PAY_SYSTEM_ID]
      const personType = this.$store.getters['sale/personTypesById'][this.entity.FIELDS.PERSON_TYPE_ID]

      result.push({
        label: 'Доставка',
        value: deliveryService ? deliveryService.NAME + ' [' + this.entity.FIELDS.DELIVERY_SERVICE_ID + ']' : this.entity.FIELDS.DELIVERY_SERVICE_ID,
      })

      result.push({
        label: 'Оплата',
        value: paysystem ? paysystem.NAME + ' [' + this.entity.FIELDS.PAY_SYSTEM_ID + ']' : this.entity.FIELDS.PAY_SYSTEM_ID,
      })

      result.push({
        label: 'Профиль',
        value: this.entity.FIELDS.PROFILE_ID
      })

      result.push({
        label: 'Тип плательщика',
        value: personType ? personType.NAME + ' [' + this.entity.FIELDS.PERSON_TYPE_ID + ']' : this.entity.FIELDS.PERSON_TYPE_ID,
      })

      result.push({
        label: 'Комментарий',
        value: this.entity.FIELDS.USER_DESCRIPTION
      })

      return result
    },

  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_admin/vorderFetch', {
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


</style>
