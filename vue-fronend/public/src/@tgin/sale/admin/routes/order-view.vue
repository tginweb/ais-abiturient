<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="pageTitle"
      dialog-width="1150px"
      @hide="onHide"
      :tabs="modesTabs"
      :tab.sync="modeId"
      :scroll-height.sync="scrollHeight"
  >

    <template v-slot:header="{entity}">

      <div class=" bg-blue-grey-5 s-font-md text-white ">

        <div class="flex no-wrap q-gutter-x-lg  leading-4">

          <div class="flex1 items-center">
            <div class="s-font-2xs text-grey-4 q-pr-sm">Номер:</div>
            <div class="">
              {{ entity.ACCOUNT_NUMBER }}
            </div>
          </div>

          <div class="flex1 items-center">
            <div class="s-font-2xs text-grey-4 q-pr-sm">ФИО:</div>
            <div class="">
              {{ propsByCode.FIO.VALUE }}
            </div>
          </div>

          <div class="flex1 items-center">
            <div class="s-font-2xs text-grey-4 q-pr-sm">Оплачен:</div>
            <div class="">
              {{ entity.IS_PAID ? 'оплачен' : 'не оплачен' }}
            </div>
          </div>

          <div class="flex1 items-center">

            <div
                class="s-font-2xs text-grey-4 q-pr-sm"
            >
              Статус:
            </div>

            <div>
              <div :style="{backgroundColor: statusColor }" class="text-white" style="padding: 1px 4px;">
                {{ entity.STATUS_NAME }}
              </div>
            </div>

          </div>

        </div>

      </div>

    </template>

    <template v-slot:default="{entity}">

      <ui-data-source
          :data.sync="events"
          ref="dsEvents"
          v-if="modesUsed['event.event_history']"
      />

      <ui-data-source
          :data.sync="autopayments"
          ref="dsAutopayments"
          v-if="modesUsed['autopayment']"
      />

      <q-tab-panels v-model="modeId" animated>

        <q-tab-panel class="q-px-none" name="common">

          <div class="row q-col-gutter-md">

            <div class="col-12 q-gutter-lg">

              <ui-admin-data-card
                  title="Общие данные"
                  :fields="sectionCommonFields"
              />

              <ui-admin-data-card
                  v-for="group of propsGroups"
                  :key="group.ID"
                  :title="group.NAME"
                  :fields="group.FIELDS"
              />

            </div>

            <div class="col-12 q-gutter-lg">

              <ui-admin-data-card
                  title="Оплата"
                  :fields="sectionPaymentFields"
                  class="q-mb-md"
              />

              <ui-admin-data-card
                  title="Корзина заказа"
              >
                <q-markup-table class="s-table-data" style="box-shadow: none;">
                  <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left">Наименование</th>
                    <th class="text-left">Цена</th>
                    <th class="text-left">
                      <div class="text-no-wrap">Кол-во</div>
                    </th>
                    <th class="text-left">Итого</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item of orderBasketItems" :key="item.ID">
                    <td>
                      <img
                          v-if="item.ELEMENT && item.ELEMENT.LIST_IMAGE"
                          style="max-width: 40px;"
                          :src="$image.resolveUrl(item.ELEMENT.LIST_IMAGE.SRC, 'r200')"
                      />
                    </td>
                    <td>
                      {{ item.NAME }}
                    </td>
                    <td>
                      <div class="no-wrap text-no-wrap">
                        {{ $util.format.price(item.PRICE, true) }}
                      </div>
                    </td>
                    <td>
                      <div class="no-wrap text-no-wrap">
                        {{ item.QUANTITY }} {{ $util.base.deepGet(item, 'ELEMENT.MEASURE.NAME') }}
                      </div>
                    </td>
                    <td>
                      <div class="no-wrap text-no-wrap">
                        {{ $util.format.price(item.FINAL_PRICE, true) }}
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </q-markup-table>
              </ui-admin-data-card>

            </div>
          </div>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="basket">

          <q-markup-table class="s-table-data" style="box-shadow: none;">
            <thead>
            <tr>
              <th class="text-left"></th>
              <th class="text-left">Наименование</th>
              <th class="text-left">Цена</th>
              <th class="text-left">
                <div class="text-no-wrap">Кол-во</div>
              </th>
              <th class="text-left">Итого</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item of orderBasketItems" :key="item.ID">
              <td style="width: 70px;">

                <img
                    v-if="item.ELEMENT && item.ELEMENT.LIST_IMAGE"
                    style="max-width: 40px;"
                    :src="$image.resolveUrl(item.ELEMENT.LIST_IMAGE.SRC, 'r200')"
                />

              </td>
              <td>
                {{ item.NAME }}
              </td>
              <td>
                <div class="no-wrap text-no-wrap">
                  {{ $util.format.price(item.PRICE) }}
                </div>
              </td>
              <td>
                <div class="no-wrap text-no-wrap">
                  {{ item.QUANTITY }} {{ $util.base.deepGet(item, 'ELEMENT.MEASURE.NAME') }}
                </div>
              </td>
              <td>
                <div class="no-wrap text-no-wrap">
                  {{ $util.format.price(item.FINAL_PRICE) }}
                </div>
              </td>
            </tr>
            </tbody>
          </q-markup-table>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="payments">

          <q-markup-table class="s-table-data" style="box-shadow: none;">
            <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Способ</th>
              <th class="text-left">Сумма</th>
              <th class="text-left">Статус</th>
              <th class="text-left">Дата оплаты</th>
              <th class="text-left">Сумма оплачена</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item of entity.PAYMENTS"
                :key="item.ID"
            >
              <td>
                {{ item.ID }}
              </td>
              <td>
                {{ item.PAY_SYSTEM_NAME }}
              </td>
              <td>
                {{ $util.format.price(item.SUM, true) }}
              </td>
              <td>
                {{ item.IS_PAID ? 'оплачен' : 'не оплачен' }}
              </td>
              <td>
                {{ item.IS_PAID ? item.DATE_PAID : '' }}
              </td>
              <td>
                {{ item.IS_PAID ? $util.format.price(item.SUM_PAID, true) : '' }}
              </td>
            </tr>
            </tbody>
          </q-markup-table>

        </q-tab-panel>

        <q-tab-panel class="q-px-none q-pt-none" name="event">

          <q-tabs
              v-model="submodeId"
              active-color="primary"
              class="text-secondary"
              dense
              align="left"
              narrow-indicator
          >
            <q-tab label="Событие" name="event"/>
            <q-tab label="История" name="event_history"/>
          </q-tabs>

          <q-tab-panels v-model="submodeId" animated>

            <q-tab-panel class="q-px-none" name="event">

              <div class="row q-col-gutter-lg">
                <div class="col-md-7">
                  <q-form ref="form" class="q-gutter-lg q-mb-md">

                    <q-select
                        v-model="eventForm.eventCode"
                        :options="orderEvents"
                        emit-value
                        label="Событие"
                        map-options
                        option-label="NAME"
                        option-value="EVENT_NAME"
                        outlined
                        class=""
                    />

                    <q-btn-toggle
                        v-if="false"
                        v-model="form.processor"
                        toggle-color="grey-7"
                        :options="[
                          {label: 'Отправка клиенту', value: 'send'},
                          {label: 'Просмотр', value: 'view'},
                        ]"
                    />

                  </q-form>
                </div>
                <div class="col-md-17">
                  <iframe
                      :src="eventRenderUrl"
                      v-if="eventRenderUrl"
                      class="full-width border-1 border-grey-5 q-pa-md"
                      :style="{
                        height: (scrollHeight-100) + 'px'
                      }"
                  />
                </div>
              </div>

            </q-tab-panel>

            <q-tab-panel class="q-px-none" name="event_history">

              <div class="row">
                <div class="col-md-12">
                  <q-markup-table class="s-table-data" style="box-shadow: none;">
                    <thead>
                    <tr>
                      <th class="text-left">ID</th>
                      <th class="text-left">Событие</th>
                      <th class="text-left">Дата создания</th>
                      <th class="text-left">Выполнено</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item of events.rows"
                        :key="item.ID"
                        @click="onEventClick(item)"
                        :class="{
                          'cursor-pointer': true,
                          '--focused': eventSelected === item
                        }"
                    >
                      <td>
                        {{ item.ID }}
                      </td>
                      <td>
                        <div class="text-weight-bold">{{ item.EVENT.NAME }}</div>
                        <div class="s-font-5xs">{{ item.EVENT_NAME }}</div>
                      </td>
                      <td>
                        {{ item.DATE_INSERT }}
                      </td>
                      <td>
                        {{ item.SUCCESS_EXEC ? 'отправлено' : 'не отправлено' }} {{ item.DATE_EXEC }}
                      </td>
                    </tr>
                    </tbody>
                  </q-markup-table>
                </div>
                <div class="col-md-12">

                  <iframe
                      :src="eventHistoryRenderUrl"
                      v-if="eventHistoryRenderUrl"
                      class="full-width border-1 border-grey-5 q-pa-md"
                      :style="{
                        height: (scrollHeight-100) + 'px'
                      }"
                  />

                </div>
              </div>

            </q-tab-panel>

          </q-tab-panels>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="autopayment">

          <ui-admin-data-card
              fieldLabelWidth="200px"
              :fields="sectionAutopaymentFields"
              class="q-mb-lg"
          />

          <c-table-paycard-payments
              class="q-pa-xs"
              ref="autopayments"
              :info="autopayments.info"
              :rows="autopayments.rows"
              :nav.sync="autopayments.nav"
              :status="autopayments.status"
              :columns-hidden="['USER_ID']"
              :pagination-enable="false"
          />

        </q-tab-panel>

      </q-tab-panels>

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";
import CTablePaycardPayments from "../component/paycard-payment/list/table";

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {
    CTablePaycardPayments
  },
  apollo: {
    orderEvents: generateQueryInfo('orderEvents', require('../gql/order/query/events.gql')),
  },
  data() {
    return {
      modeId: 'common',
      submodeId: '',

      orderEvents: [],
      eventForm: {
        eventCode: 'SALE_NEW_ORDER',
        processor: 'mail'
      },
      events: {
        query: () => require('../gql/order/query/events_history.gql'),
        filterSchema: [],
        variables: {
          id: parseInt(this.entityId)
        },
        where: {},
        rows: [],
        status: {
          loaded: false,
          loading: false,
        },
      },
      autopayments: {
        recordsetQuery: () => require('../gql/paycard-payment/query/recordset.gql'),
        filterSchema: [],
        filter: {},
        where: {},
        rows: [],
        info: {
          total: 0
        },
        nav: {},
        status: {
          loaded: false,
          loading: false,
        },
      },
      eventSelected: null
    }
  },
  computed: {
    statusColor() {
      return this.entity.STATUS_COLOR || '#aaa'
    },
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
          id: 'basket',
          label: 'Корзина',
          type: 'tab',
          actions: () => {
            return []
          }
        },
        {
          id: 'payments',
          label: 'Оплаты',
          type: 'tab',
          actions: () => {
            return []
          }
        },
        {
          id: 'event',
          label: 'События',
          type: 'tab',
          defaultSubmode: 'event',
          actions: () => {
            const res = []
            if (this.submodeId === 'event') {
              res.push({
                label: 'Отправить клиенту',
                callback: this.onSubmitEvent,
                loading: this.requestState.mutating
              })
            }
            return res
          }
        },
        {
          id: 'autopayment',
          label: 'Автооплата',
          type: 'tab',
          actions: () => {
            const res = []
            if (this.entity.IS_CAN_PAY_ONLINE || true) {
              res.push({
                label: 'Оплатить',
                callback: this.onSubmitEvent,
                loading: this.requestState.mutating
              })
            }
            return res
          }
        }
      ]
    },

    pageTitle() {
      return 'Заказ ' + (this.entity ? this.entity.ACCOUNT_NUMBER + ' / ' + this.entityId : this.entityId)
    },

    eventHistoryRenderUrl() {
      if (this.eventSelected) {
        return this.$apiUrl('/main/template/render-event?ENTITY_ID=' + this.entityIdState + '&EVENT_ID=' + this.eventSelected.ID + '&PREPROCESSOR=order')
      }
    },
    eventRenderUrl() {
      if (this.eventForm.eventCode) {
        return this.$apiUrl('/main/template/render-event?ENTITY_ID=' + this.entityIdState + '&EVENT_TYPE_NAME=' + this.eventForm.eventCode + '&PREPROCESSOR=order')
      }
    },
    sectionAutopaymentFields() {

      const result = []

      result.push({
        label: 'Можно оплатить онлайн',
        value: this.entity.IS_CAN_PAY_ONLINE ? 'да' : 'нет',
      })

      result.push({
        label: 'Выбрана карта оплаты',
        value: this.propsByCode.ONLINE_PAYMENT_CARD_ID && this.propsByCode.ONLINE_PAYMENT_CARD_ID.VALUE ? 'да' : 'нет',
      })

      return result
    },

    sectionCommonFields() {

      const result = []

      result.push({
        label: 'Номер / ID заказа',
        value: this.entity.ACCOUNT_NUMBER + ' / ' + this.entity.ID,
      })

      result.push({
        label: 'Дата создания',
        value: this.$util.date.timestampToFormat(this.entity.DATE_INSERT, 'DD.MM.YYYY HH:mm')
      })

      result.push({
        label: 'Дата изменения',
        value: this.$util.date.timestampToFormat(this.entity.DATE_UPDATE, 'DD.MM.YYYY HH:mm')
      })

      result.push({
        label: 'Статус',
        value: this.entity.STATUS_NAME,
        valueStyle: {backgroundColor: this.statusColor},
        valueClass: 'text-white q-px-sm'
      })

      return result
    },

    sectionPaymentFields() {

      const result = []

      result.push({
        label: 'Способ оплаты',
        value: this.entity.PAY_SYSTEM_NAME,
      })

      result.push({
        label: 'Статус оплаты',
        value: this.entity.IS_PAID ? 'оплачен' : 'не оплачен',
        valueClass: ['q-px-sm', this.entity.IS_PAID ? 'text-white bg-green' : 'text-white bg-grey-6'],
      })

      if (this.entity.IS_PAID) {
        result.push({
          label: 'Дата оплаты',
          value: this.$util.date.timestampToFormat(this.entity.DATE_PAYED, 'DD.MM.YYYY HH:mm')
        })
      }

      return result
    },

    actions() {
      const actions = this.mode && this.mode.actions
      return actions && (typeof actions === 'function' ? actions() : actions)
    },

    isJuridical() {
      return this.propsByCode.IS_COMPANY && this.propsByCode.IS_COMPANY.VALUE === 'Y'
    },

    propsGroups() {

      return this.$store.state.sale.app.orderPropGroups.map((group) => {

        const fields = (this.propsByGroupId[group.ID] || [])
            .filter(prop => {

              if (!this.isJuridical && /^COMPANY\_/i.test(prop.CODE)) {
                return false
              }

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

    propsByGroupId() {
      return this.props.reduce((map, item) => {
        if (!map[item.GROUP_ID])
          map[item.GROUP_ID] = []
        map[item.GROUP_ID].push(item)
        return map
      }, {}) || {}
    },

    props() {
      return this.entity && this.entity.PROPS ? this.entity.PROPS : []
    },

    propsByCode() {
      return (this.entity ? this.entity.PROPS : []).reduce((map, obj) => (map[obj.CODE] = obj, map), {})
    },

    orderBasketItems() {
      return this.entity.ITEMS.map((item) => {
        const result = {
          ...item,
        }

        if (item.ELEMENT) {
          result.IMAGE = item.ELEMENT.PREVIEW_PICTURE || item.ELEMENT.DETAIL_PICTURE
        }

        return result
      })
    }

  },
  created() {
    this.fetch()
  },

  methods: {

    onEventClick(item) {
      this.eventSelected = item
    },

    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_admin/orderFetch', {
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

    async onSubmitEventCommit() {
      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/order/mutation/event.gql'),
          variables: {
            id: this.entity.ID,
            eventCode: this.eventForm.eventCode
          },
          state: this.requestState
        })
      } catch (e) {
        console.log(e)
      }
    },

    async onSubmitEvent() {
      try {
        if (await this.$refs.form.validate())
          await this.onSubmitEventCommit()
      } catch (e) {
      }
    },

  },
  watch: {

    'entity.ID'(id) {
      this.autopayments.filter.ORDER_ID = {eq: id}
    }
  }
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
