<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="'Пользователь ' + entityId"
      dialog-width="1350px"
      @hide="onHide"
      :tabs="modesTabs"
      :tab.sync="modeId"
      :scroll-height.sync="scrollHeight"
  >

    <template v-slot:head="{entity}">


    </template>

    <template v-slot:default="{entity}">

      <ui-data-source
          :data.sync="orders"
          ref="dsOrders"
          v-if="modesUsed.orders"
      />

      <ui-data-source
          :data.sync="paycards"
          ref="dsPaycards"
          v-if="modesUsed.paycards"
      />

      <ui-data-source
          :data.sync="profiles"
          ref="dsProfiles"
          v-if="modesUsed.profiles"
      />

      <q-tab-panels v-model="modeId" animated>

        <q-tab-panel class="q-px-none" name="common">

          <div class="row q-col-gutter-md">

            <div class="col-12 q-gutter-lg">

              <ui-admin-data-card
                  :fields="sectionCommonFields"
              />

              <ui-admin-data-card
                  title="Группы"
              >
                <ul class="q-pl-md q-gutter-sm q-mt-md">
                  <li v-for="group of entity.GROUPS_INFO" :key="group.ID" >
                    {{group.NAME}}
                  </li>
                </ul>
              </ui-admin-data-card>

            </div>

            <div class="col-12 q-gutter-lg">


            </div>

          </div>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="orders">

          <ui-data-panel
              :data="orders"
              ref="orders"
              :filters-enable="true"
              :filters-paths-hidden="['USER_ID']"
              :filter-width="20"
              :table-height="(scrollHeight-80)+'px'"
              :datasource-external="true"
              :handler="$refs.dsOrders.$apollo.queries.recordset"
              v-if="$refs.dsOrders"
          />

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="paycards">

          <ui-data-panel
              :data="paycards"
              ref="paycards"
              :filters-enable="false"
              :table-height="(scrollHeight-80)+'px'"
              :datasource-external="true"
              :handler="$refs.dsPaycards.$apollo.queries.recordset"
              v-if="$refs.dsPaycards"
          />

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="profiles">

          <ui-data-panel
              :data="profiles"
              ref="profiles"
              :filters-enable="false"
              :table-height="(scrollHeight-80)+'px'"
              :datasource-external="true"
              :handler="$refs.dsProfiles.$apollo.queries.recordset"
              v-if="$refs.dsProfiles"
          />

        </q-tab-panel>

      </q-tab-panels>

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import CTableOrders from "@tgin/sale/admin/component/order/list/table";
import CTablePaycards from "@tgin/sale/admin/component/paycard/list/table";
import CTableProfiles from "@tgin/sale/admin/component/profile/list/table";

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {},
  data() {

    return {
      modeId: 'common',
      orders: {
        table: {
          com: CTableOrders,
          columnsHidden: ['USER_ID']
        },
        recordsetQuery: () => require('@tgin/sale/admin/gql/order/query/recordset.gql'),
        filterQuery: () => require('@tgin/sale/admin/gql/order/query/filters.gql'),
        filterSchema: [],
        filter: {

        },
        where: {},
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 10
        },
        status: {
          loaded: false,
          loading: false,
        },
      },
      paycards: {
        table: {
          com: CTablePaycards,
          columnsHidden: ['USER_ID']
        },
        recordsetQuery: () => require('@tgin/sale/admin/gql/paycard/query/recordset.gql'),
        filterQuery: () => require('@tgin/sale/admin/gql/paycard/query/filters.gql'),
        filterSchema: [],
        filter: {
          USER_ID: {eq: this.entityId}
        },
        where: {},
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 10
        },
        status: {
          loaded: false,
          loading: false,
        },
      },
      profiles: {
        table: {
          com: CTableProfiles,
          columnsHidden: ['USER_ID']
        },
        recordsetQuery: () => require('@tgin/sale/admin/gql/profile/query/recordset.gql'),
        filterQuery: () => require('@tgin/sale/admin/gql/profile/query/filters.gql'),
        filterSchema: [],
        filter: {

        },
        where: {},
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
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
      return [
        {
          id: 'common',
          label: 'Общее',
          type: 'tab',
        },
        {
          id: 'orders',
          label: 'Заказы',
          type: 'tab',
        },
        {
          id: 'paycards',
          label: 'Карты',
          type: 'tab',
        },
        {
          id: 'profiles',
          label: 'Профили',
          type: 'tab',
        },
      ]
    },

    sectionCommonFields() {

      const result = [
        {label: 'ID', value: this.entity.ID},
        {label: 'Логин', value: this.entity.LOGIN},
        {label: 'E-mail', value: this.entity.EMAIL},
        {label: 'Фамилия', value: this.entity.LAST_NAME},
        {label: 'Имя', value: this.entity.NAME},
        {label: 'Отчество', value: this.entity.SECOND_NAME},
      ]

      return result
    },

    sectionGroupsFields() {

      return this.entity.GROUPS_INFO.map(item => {
        return {
          label: item.NAME,
          value: ' '
        }
      })
    },
  },
  created() {
    this.fetch()
  },

  methods: {

    async fetch() {
      try {
        const entity = await this.$store.dispatch('user_admin/userFetch', {
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
  watch: {
    'entity.ID'(id) {
      this.orders.filter.USER_ID = {eq: id}
      this.paycards.filter.USER_ID = {eq: id}
      this.profiles.filter.USER_ID = {eq: id}
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
