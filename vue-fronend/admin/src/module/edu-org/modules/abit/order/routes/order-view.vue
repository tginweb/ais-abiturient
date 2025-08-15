<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :loaded="fetched"
      :title="'Заявление ' + entityId"
      @hide="onHide"
      dialogWidth="1150px"
      v-if="entity"
  >
    <template v-slot:default>

      <div class="q-mb-md q-pa-md border-1 border-dark s-font-sm">

        <div class="flex no-wrap q-gutter-x-lg ">
          <div class="">
            <div class="s-font-xs text-grey">ID:</div>
            {{ entity.nid }}
          </div>
          <div class="">

            <div class="s-font-xs text-grey">ФИО:</div>

            <div class="text-weight-bold">
                 {{ [personal.lastName, personal.firstName, personal.secondName].join(' ') }}
            </div>

          </div>

          <div class="" v-if="entity.orderType">
            <div class="s-font-xs text-grey">Тип:</div>
            {{ entity.orderType.name }}
          </div>

          <div class="">

            <div class="s-font-xs text-grey">Источник:</div>

            <div v-if="entity.cordersource==='epgu'" class="text-weight-bold">
              ЕПГУ
            </div>
            <div v-else-if="entity.onEpgu" class="text-weight-bold">
              ЛК + ЕПГУ
            </div>
            <div v-else class="text-weight-bold">
              ЛК
            </div>

          </div>


          <div class="" style="white-space: nowrap;">
            <div class="s-font-xs text-grey">Отправлена:</div>
            {{ entity.sendDate ? $util.date.timestampToFormat(entity.sendDate, 'DD MMMM HH:mm') : 'не отправлялось' }}
          </div>

          <q-space/>

          <div v-if="false" class="">
            <div class="s-font-xs text-grey">Шаг:</div>
            шаг
          </div>

          <div class="">

            <div
                class="s-font-xs text-grey"
            >
              Статус:
            </div>

            <div
                :style="{
              color: entity.state.statusInfo.color
            }"
            >
              {{ entity.state.statusInfo.titleAdmin }}
            </div>


          </div>

        </div>


      </div>

      <q-tabs
          v-model="tab"
          active-bg-color="secondary"
          active-color="white"
          align="justify"
          class=" text-secondary bg-grey-4"
          dense
          indicator-color="white"
          narrow-indicator

      >
        <q-tab label="Данные" name="common"/>
        <q-tab label="Заявления" name="apps"/>
        <q-tab label="Файлы" name="files"/>
        <q-tab label="История" name="history"/>
        <q-tab label="Чат" name="chat"/>
        <q-tab label="Печать" name="print"/>
        <q-tab label="ЕПГУ" name="epgu"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>

        <q-tab-panel class="q-px-none" name="common">

          <div class="row q-col-gutter-x-md q-col-gutter-y-lg q-mb-lg">

            <div class="col-24 col-lg-12">

              <COrderSectionPersonal :order="entity"></COrderSectionPersonal>
              <COrderSectionEducation :order="entity"></COrderSectionEducation>
              <COrderSectionAddress :order="entity"></COrderSectionAddress>
              <COrderSectionOther :order="entity"></COrderSectionOther>

            </div>

            <div class="col-24 col-lg-12">

              <div class="com s-info-section">

                <div class="flex items-center q-mb-sm">
                  <div class="__header q-mb-none" style="margin: 0;">Заявления</div>
                  <div class="q-ml-auto">
                    <a href="#" class="text-primary" @click.prevent="tab='apps'">
                      <span style="text-decoration: underline;">перейти к подробностям</span>
                      <q-icon :name="$icons.chevronRight" class="q-ml-sm" size="14px"/>
                    </a>
                  </div>
                </div>

                <q-markup-table
                    v-if="entity.applications.items.length>0"
                    class="c-applications s-table-data"
                    flat
                >
                  <thead>
                  <tr>

                    <th title="Приоритет">
                      <div style="white-space: nowrap">ПР-Т</div>
                    </th>
                    <th>Направление</th>
                    <th>Подано</th>
                    <th>Статус в ЛК</th>
                    <th>Согл</th>
                  </tr>
                  </thead>
                  <tbody>

                  <tr
                      v-for="(item, index) in entity.applications.items"
                      :style="{
                    backgroundColor1: item.deleted ? '#FFF0F0' : ''
                  }"
                      class="__item"
                  >

                    <td class="dense">

                      {{ item.priority }}

                    </td>

                    <td class="">


                      <div v-if="item.admission" :title="item.admission.id + '.' + item.source.id">

                        {{ item.admission.abbr }}

                        {{ item.admission.direct_name }}

                        <div class="text-weight-bold">
                          {{ item.admission.fob.name }}
                        </div>

                      </div>

                      <div v-if="item.source" class="text-grey-8">
                        {{ item.source.name }}
                      </div>

                    </td>

                    <td class="">

                      <div class="q-gutter-y-xs">

                        <div>
                          <div v-if="item.cappsource==='epgu'">
                            <b>ЕПГУ</b>
                          </div>
                          <div v-else>
                            <b>ЛК</b>
                          </div>
                        </div>

                      </div>

                    </td>

                    <td class="">

                      <template v-if="false">

                        <div v-if="item.status" class="">
                          {{ item.status.name }}
                        </div>

                        <div v-if="item.statusMessage" class="q-mt-sm">
                          Сообщение: {{ item.statusMessage }}
                        </div>

                        <div v-if="item.deleted" class="q-mt-sm">
                        <span class="bg-red q-px-sm text-white" style="white-space: nowrap;">
                          удалено через {{ {lk: 'ЛК', epgu: 'ЕПГУ', admin: 'ИРНИТУ'}[item.deletedSource] }}
                        </span>
                        </div>

                      </template>


                    </td>
                    <td>
                      <span v-if="item.agree"><q-icon name="far fa-check-circle" color="green"/> согласие</span>
                      <span v-else-if="item.agreeDeny"><q-icon name="fas fa-ban" color="red"/> отказ</span>
                    </td>
                  </tr>

                  </tbody>

                </q-markup-table>

                <div v-else class="text-grey-7">
                  направления не выбраны
                </div>


              </div>

              <COrderSectionSubjects :order="entity"></COrderSectionSubjects>
              <COrderSectionAchievements :order="entity"></COrderSectionAchievements>
              <COrderSectionQuotes :order="entity"></COrderSectionQuotes>

            </div>


          </div>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="apps">

          <div class="row q-col-gutter-x-md q-col-gutter-y-lg q-mb-lg">

            <div class="col-24">

              <div class="com s-info-section">

                <div class="__header">Активные заявления</div>

                <q-markup-table
                    v-if="appsActive.length>0"
                    class="c-applications s-table-data"
                    flat
                >
                  <thead>
                  <tr>
                    <th>
                      <q-checkbox v-model="appActiveSelectAll" dense/>
                    </th>
                    <th title="Приоритет">
                      <div style="white-space: nowrap">ПР-Т</div>
                    </th>
                    <th>Направление</th>
                    <th>Согласие</th>
                    <th>Статус в ЛК</th>
                    <th>Статус в ЕПГУ</th>
                    <th>Подано</th>
                    <th>ЕПГУ данные</th>
                  </tr>
                  </thead>
                  <tbody>

                  <tr
                      v-for="(item, index) in appsActive"
                      :style="{
                    backgroundColor1: item.deleted ? '#FFF0F0' : ''
                  }"
                      class="__item"
                  >
                    <td class="dense">
                      <q-checkbox v-model="selectedAppsActive[item._id]" :false-value="null" dense/>
                    </td>

                    <td class="dense">

                      <template v-if="false && !item.deleted && (accessAppsEdit || accessOrderManage)">
                        <q-select
                            v-model="item.priority"
                            :options=" Array.from(Array(entity.applications.items.length).keys()).map((n => ({value:n+1, label: n+1})))"
                            color="grey-3"
                            dense
                            emit-value
                            map-options
                            outlined
                            @input="onAppsArrange"
                        />
                      </template>
                      <template v-else>
                        {{ item.priority }}
                      </template>

                    </td>

                    <td class="">

                      <div v-if="item.admission" :title="item.admission.id + '.' + item.source.id">

                        {{ item.admission.abbr }}

                        {{ item.admission.direct_name }}

                        <div class="text-weight-bold">
                          {{ item.admission.fob.name }}
                        </div>

                      </div>

                      <div v-if="item.source" class="text-grey-8">
                        {{ item.source.name }}
                      </div>

                    </td>

                    <td>
                      <span v-if="item.agree"><q-icon name="far fa-check-circle" color="green"/> согласие</span>
                      <span v-else-if="item.agreeDeny"><q-icon name="fas fa-ban" color="red"/> отказ</span>
                    </td>

                    <td class="">

                      <template v-if="false">
                        <div v-if="item.status" class="">
                          {{ item.status.name }}
                        </div>
                        <div v-else>
                          не определен
                        </div>

                        <div v-if="item.statusMessage" class="q-mt-sm">
                          Сообщение: {{ item.statusMessage }}
                        </div>

                        <div v-if="item.deleted" class="q-mt-sm">
                        <span class="bg-red q-px-sm text-white" style="white-space: nowrap;">
                           удалено через {{ {lk: 'ЛК', epgu: 'ЕПГУ', admin: 'ИРНИТУ'}[item.deletedSource] }}
                        </span>
                        </div>
                      </template>


                    </td>

                    <td>


                    </td>

                    <td class="" style="min-width:140px;">

                      <div class="q-gutter-y-xs">

                        <div>
                          <div v-if="item.cappsource==='epgu'">
                            через <b>ЕПГУ</b>
                          </div>
                          <div v-else>
                            через <b>ЛК</b>
                          </div>
                        </div>

                        <div v-if="item.createAt">
                          создано: {{ $util.date.timestampToFormat(item.createAt, 'DD MMMM HH:mm') }}
                        </div>


                      </div>

                    </td>

                    <td>


                    </td>

                  </tr>

                  </tbody>

                </q-markup-table>

                <div v-else class="text-grey-7">
                  направления не выбраны
                </div>

                <div class="flex q-gutter-md q-mt-sm" v-if="false">

                  <q-btn
                      class="q-mt-md"
                      v-if="selectedAppsActiveIds.length"
                      color="primary"
                      label="Установить статус"
                      @click="onAppsSetStatus('active')"
                  />

                  <q-btn
                      v-if="false && entity.applications.items.find(item => !!item.selected)"
                      class="q-mt-md"
                      color="primary"
                      label="Перенести статусы с ЕПГУ"
                      @click="onAppsSetStatusFromEpgu"
                  />

                  <q-space/>

                  <q-btn
                      v-if="accessAppsEdit"
                      :icon="$icons.plus"
                      class="q-mt-md"
                      color="primary"
                      label="Добавить"
                      @click="onAppsAdd"
                  />

                  <q-btn
                      v-if="false && accessAppsEdit && entity.applications.items.find(item => !!item.selected)"
                      :icon="$icons.close"
                      class="q-mt-md"
                      color="red"
                      label="Удалить или отозвать"
                      @click="onAppsDelete"
                  />

                </div>

              </div>

              <div class="com s-info-section">

                <div class="__header">Удаленные заявления</div>

                <q-markup-table
                    v-if="appsDisable.length>0"
                    class="c-applications s-table-data"
                    flat
                >
                  <thead>
                  <tr>
                    <th>
                      <q-checkbox v-model="appDisableSelectAll" dense/>
                    </th>
                    <th>Направление</th>
                    <th>Согласие</th>
                    <th>Статус в ЛК</th>
                    <th>Статус в ЕПГУ</th>
                    <th>Подано</th>
                    <th>ЕПГУ данные</th>
                  </tr>
                  </thead>
                  <tbody>

                  <tr
                      v-for="(item, index) in appsDisable"
                      :style="{
                    backgroundColor1: item.deleted ? '#FFF0F0' : ''
                  }"
                      class="__item"
                  >
                    <td class="dense">
                      <q-checkbox v-model="selectedAppsDisable[item._id]" :false-value="null" dense/>
                    </td>

                    <td class="">

                      <div v-if="item.admission" :title="item.admission.id + '.' + item.source.id">

                        {{ item.admission.abbr }}

                        {{ item.admission.direct_name }}

                        <div class="text-weight-bold">
                          {{ item.admission.fob.name }}
                        </div>

                      </div>

                      <div v-if="item.source" class="text-grey-8">
                        {{ item.source.name }}
                      </div>

                    </td>

                    <td>
                      <span v-if="item.agree"><q-icon name="far fa-check-circle" color="green"/> согласие</span>
                      <span v-else-if="item.agreeDeny"><q-icon name="fas fa-ban" color="red"/> отказ</span>
                    </td>

                    <td class="">

                      <template v-if="false">
                        <div v-if="item.status" class="">
                          {{ item.status.name }}
                        </div>
                        <div v-else>
                          не определен
                        </div>

                        <div v-if="item.statusMessage" class="q-mt-sm">
                          Сообщение: {{ item.statusMessage }}
                        </div>

                        <div v-if="item.deleted" class="q-mt-sm">
                        <span class="bg-red q-px-sm text-white" style="white-space: nowrap;">
                           удалено через {{ {lk: 'ЛК', epgu: 'ЕПГУ', admin: 'ИРНИТУ'}[item.deletedSource] }}
                        </span>
                        </div>
                      </template>

                    </td>

                    <td>

                      <div v-if="!item.epguData.UIDEpgu">

                        нет в ЕПГУ

                      </div>

                      <div v-else class="q-gutter-y-xs">

                        <div v-if="item.epguData.status" class="">

                        <span class="q-mr-sm">
                          {{ item.epguData.status.name }}
                        </span>

                          <span v-if="item.epguState.statusExportNeed" title="Экспорт статуса запланирован">
                          <q-icon :name="$icons.fasCalendarAlt"/>
                        </span>
                          <span v-else-if="item.epguState.statusExported" title="Статус экспортирован">
                          <q-icon :name="$icons.fasCheck"/>
                        </span>

                        </div>

                      </div>

                    </td>

                    <td class="" style="min-width:140px;">

                      <div class="q-gutter-y-xs">

                        <div>
                          <div v-if="item.cappsource==='epgu'">
                            через <b>ЕПГУ</b>
                          </div>
                          <div v-else>
                            через <b>ЛК</b>
                          </div>
                        </div>

                        <div v-if="item.createAt">
                          создано: {{ $util.date.timestampToFormat(item.createAt, 'DD MMMM HH:mm') }}
                        </div>


                      </div>

                    </td>

                    <td>

                      <div v-if="!!item.epguData.UIDEpgu" class="q-gutter-y-xs">

                        <div style="white-space: nowrap">

                          ID: <span>{{ item.epguData.UIDEpgu }}</span>

                        </div>


                        <div style="white-space: nowrap">

                        <span v-if="item.epguState.exportNeed">
                          нужен экспорт
                        </span>
                          <span v-else>
                        </span>

                        </div>

                        <div style="white-space: nowrap">

                        <span v-if="item.epguState.exported">
                          экспортировано
                        </span>
                          <span v-else>
                          не экспортировано
                        </span>

                        </div>

                      </div>

                    </td>

                  </tr>

                  </tbody>

                </q-markup-table>

                <div v-else class="text-grey-7">
                  направления не выбраны
                </div>

                <div class="flex q-gutter-md q-mt-sm" v-if="false">

                  <q-btn
                      v-if="selectedAppsDisableIds.length"
                      class="q-mt-md"
                      color="primary"
                      label="Установить статус"
                      @click="onAppsSetStatus('disable')"
                  />

                  <q-btn
                      v-if="false && entity.applications.items.find(item => !!item.selected)"
                      class="q-mt-md"
                      color="primary"
                      label="Перенести статусы с ЕПГУ"
                      @click="onAppsSetStatusFromEpgu"
                  />

                  <q-space/>

                  <q-btn
                      v-if="false && accessAppsEdit && entity.applications.items.find(item => !!item.selected)"
                      :icon="$icons.close"
                      class="q-mt-md"
                      color="red"
                      label="Удалить или отозвать"
                      @click="onAppsDelete"
                  />

                </div>


              </div>

            </div>


          </div>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="files">

          <CFiles :entity="entity"/>

          <COrderSectionFilesAdmin :order="entity"/>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="history">

          <div class="com s-info-section">

            <q-list class="__items">
              <q-item class="__item">
                <q-item-section class="__title">Создана:</q-item-section>
                <q-item-section class="__value" side>
                  {{ $util.date.timestampToFormat(entity.createAt, 'datetime') }}
                </q-item-section>
              </q-item>
              <q-item class="__item">
                <q-item-section class="__title">Изменена:</q-item-section>
                <q-item-section class="__value" side>
                  {{ $util.date.timestampToFormat(entity.updateAt, 'datetime') }}
                </q-item-section>
              </q-item>
            </q-list>

          </div>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="chat">

          <messenger-chat-admin
              :chatId="entity._id"
              :messages="entity.messages"
              scrollHeight="calc(100vh - 430px)"
              @submit="onMessageSubmit"
          />

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="print">

          <c-tab-print
              :value="entity"
          />

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="epgu">

          <CTabEpgu :entityInput.sync="entity" @refetch="fetch(true)"/>

        </q-tab-panel>

      </q-tab-panels>

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

import * as sections from '@project/components/entity/order/section'
import CTabPrint from './order-view-print'
import CTabEpgu from './order-view/tab-epgu'
import CFiles from '../component/entity/detail/files'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {
    CTabPrint,
    CTabEpgu,
    CFiles,
    ...sections
  },
  data() {
    return {
      tab: 'common',
      tabEntities: 'source',
      dialogIs: 'ui-admin-dialog',
      epguDocsSelectAll: false,

      appActiveSelectAll: false,
      appDisableSelectAll: false,

      selectedAppsActive: {},
      selectedAppsDisable: {},
    }
  },
  computed: {
    selectedAppsActiveIds() {
      return Object.keys(this.selectedAppsActive).filter(id => !!this.selectedAppsActive[id])
    },

    selectedAppsDisableIds() {
      return Object.keys(this.selectedAppsDisable).filter(id => !!this.selectedAppsDisable[id])
    },

    appsActive() {
      return this.entity.applications.items.filter(item => !item.deleted)
    },

    appsDisable() {
      return this.entity.applications.items.filter(item => item.deleted)
    },

    personal() {
      return this.entity.anket.personal
    },
    actions() {
      return [
        {
          title: 'Обновить',
          position: 'header',
          type: 'callback',
          outline: true,
          callback: () => {
            this.fetch(true)
          }
        },
        {
          title: 'Операции',
          position: 'header',
          children: this.entity.actions.filter(item => item.name !== 'view')
        },
      ]
    },

    accessAppsEdit() {
      return this.$store.getters['user/user'].roles.indexOf('admin') > -1
    },

    accessOrderManage() {
      return this.entity.perms.indexOf('canManage') > -1
    },

  },
  created() {
    this.fetch()
  },

  methods: {

    async onAppsSetStatus(scope) {

      const apps = scope === 'active' ?
          this.entity.applications.items.filter(app => this.selectedAppsActiveIds.indexOf(app._id) > -1) :
          this.entity.applications.items.filter(app => this.selectedAppsDisableIds.indexOf(app._id) > -1)

      this.$router.push({
        name: 'edu.order:apps-set-status',
        params: {
          entityId: this.entityId,
          apps: apps,
          onResolve: () => {
            this.fetch(true)
          }
        }
      })

    },

    async onAppsAdd() {

      this.$store.dispatch('router/vrouterNav', {
        is: 'edu-order-admissions-add',
        props: {
          order: this.entity,
          onSelect: async (admission, competition) => {

            try {

              let {data: {res: {result}}} = await this.$apollo.mutate({
                mutation: require('../gql/order/mutation/appAdd.gql'),
                variables: {
                  _id: this.entity._id,
                  cadmission: admission.id,
                  csource: competition.csource,
                }
              })

              this.$bus.emit('processMessages', result.messages);

              if (result.success) {
                await this.fetch(true)
              }
            } catch (e) {
              console.log(e)
            }
          }
        }
      })

    },

    async onAppsDelete() {

      this.$q.dialog({
        title: 'Удалить заявления',
        message: 'Вы действительно удалить или отозвать заявления',
        cancel: true,
        persistent: true
      }).onOk(async () => {

        try {

          let {data: {res: {result}}} = await this.$apollo.mutate({
            mutation: require('../gql/order/mutation/appsAction.gql'),
            variables: {
              _id: this.entity._id,
              appsIds: this.selectedAppsIds,
              action: 'delete',
            }
          })

          this.$bus.emit('processMessages', result.messages);

          if (result.success) {
            await this.fetch(true)
          }

        } catch (e) {

          console.log(e)
        }

      })
    },

    async onAppsArrange() {
      try {

        let {data: {res: {result}}} = await this.$apollo.mutate({
          mutation: require('../gql/order/mutation/appsAction.gql'),
          variables: {
            _id: this.entity._id,
            action: 'arrange',
            data: this.entity.applications.items.filter(app => !!app.priority && !app.deleted)
          }
        })

        this.$bus.emit('processMessages', result.messages);

        if (result.success) {
          await this.fetch(true)
        }

      } catch (e) {
        console.log(e)
      }
    },

    async onAppsSetStatusFromEpgu() {

      this.$q.dialog({
        title: 'Перенос статусов с ЕПГУ',
        message: 'Вы действительно хотите перенести статусы с ЕПГУ в актуальные',
        cancel: true,
        persistent: true
      }).onOk(async () => {

        try {

          let {data: {res: {result}}} = await this.$apollo.mutate({
            mutation: require('../gql/order/mutation/appsAction.gql'),
            variables: {
              _id: this.entity._id,
              appsIds: this.selectedAppsIds,
              action: 'setStatusFromEpgu',
            }
          })

          this.$bus.emit('processMessages', result.messages);

          if (result.success) {
            await this.fetch(true)
          }

        } catch (e) {

          console.log(e)
        }

      })
    },

    async onEpguAppsToActual() {

      this.$q.dialog({
        title: 'Перенос заявлений с ЕПГУ',
        message: 'Вы действительно хотите перенести заявления с ЕПГУ в актуальные',
        cancel: true,
        persistent: true
      }).onOk(async () => {

        const res = await this.$store.dispatch(
            'edu_order/entityEpguAppsToActual', {
              _id: this.entity._id,
            }
        )

        this.$bus.emit('processMessages', res.result.messages);

        await this.fetch(true)

      })

    },

    async onEpguDocsAttach(status) {

      const docIds = this.entity.epguDocs.filter(item => item.selected).map(item => item._id)

      if (docIds.length) {

        this.$q.dialog({
          title: status ? 'Прикрепление' : 'Открепление',
          message: status ? 'Вы действительно хотите ПРИКРЕПИТЬ документы к заявлению' : 'Вы действительно хотите ОТКРЕПИТЬ документы от заявления',
          cancel: true,
          persistent: true
        }).onOk(async () => {

          const res = await this.$store.dispatch(
              'edu_order/entityEpguDocActionMultiple', {
                _id: this.entity._id,
                docIds: docIds,
                action: status ? 'attach' : 'detach',
              }
          )

          this.$bus.emit('processMessages', res.result.messages);

          await this.fetch(true)
        })

      }

    },

    async onEpguDocsImport() {

      const targets = this.entity.epguDocs.filter(item => item.selected).map(item => 'edu_order.epguDoc:' + this.entityId + '.' + item.id)

      if (targets.length) {

        const res = await this.$store.dispatch(
            'edu_epgu_task/entityAddFromTargets', {
              targets: targets,
              action: 'import',
            }
        )

        this.$bus.emit('processMessages', res.result.messages);
      }

    },

    async onMessageSubmit() {
      await this.fetch()
    },

    async onActionResolve() {

      this.onResolve()
      await this.fetch()
    },
    async onSubmit() {
      try {

      } catch (e) {
        console.log(e)
      }
    },
    async fetch(refetch) {

      this.appActiveSelectAll = false
      this.appDisableSelectAll = false
      this.selectedAppsActive = []
      this.selectedAppsDisable = []


      await this.fetchingMethod(async () => {
        this.entity = !refetch && this.entityData || await this.$store.dispatch('edu_order/entityQuerySingle', {id: this.entityId})
      })


    },

  },
  watch: {

    appActiveSelectAll(val) {
      this.selectedAppsActive = val ? this.appsActive.reduce((map, item) => (map[item._id] = true, map), {}) : []
    },

    appDisableSelectAll(val) {
      this.selectedAppsDisable = val ? this.appsDisable.reduce((map, item) => (map[item._id] = true, map), {}) : []
    },

    epguDocsSelectAll(val) {
      this.entity.epguDocs.forEach(doc => {
        doc.selected = val || null
      })
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
