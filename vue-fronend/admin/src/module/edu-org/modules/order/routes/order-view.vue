<template xmlns="http://www.w3.org/1999/html">

  <component
      v-if="entity"
      v-model="visible"
      :loaded="fetched"
      :loading="fetching"
      :persistent="persistent"
      :title="'Заявление ' + entityNid"
      :headerToolbar="[{
        label: 'Операции',
        children: entity.actions
      }]"
      :onActionSuccess="onActionSuccess"
      :entityId="entityId"
      dialogWidth="1450px"
      dialogMaxWidth="90vw"
      v-bind="bindRouterWrapper"
      @hide="onHide"
      @shake="onShake"
      @before-hide="onBeforeHide"
  >
    <template v-slot:default>


      <div class="q-mb-md q-pa-md border-1 border-dark s-font-sm bg-white">

        <div class="flex no-wrap q-gutter-x-lg ">

          <div class="">
            <div class="s-font-xs text-grey">ID:</div>
            {{ entity.nid }}
          </div>

          <div class="">
            <div class="s-font-xs text-grey text-no-wrap">Рег. номер:</div>
            {{ entity.regnum }}
          </div>


          <div v-if="entity.orderType" class="">
            <div class="s-font-xs text-grey">Тип:</div>
            {{ entity.orderType.nameShort }}
          </div>

          <div class="">
            <div class="s-font-xs text-grey">ФИО:</div>
            <div class="text-weight-bold">
              {{ [personal.lastName, personal.firstName, personal.secondName].join(' ') }}
            </div>
          </div>

          <div class="">
            <div class="s-font-xs text-grey">СНИЛС:</div>
            <div class="text-weight-bold">
              {{ entity.snils }}
            </div>
            <div class="s-font-xs text-grey">Паспорт:</div>
            <div class="">
              {{ entity.passport }}
            </div>
          </div>



          <div class="">

            <div class="s-font-xs text-grey">Как создан:</div>

            <div class="">
              {{ entity.ordersourceName }}
            </div>

          </div>


          <div class="">
            <div class="s-font-xs text-grey">Аккаунт:</div>
            <div class="text-weight-bold" style="max-width:40px;overflow:hidden;">
              {{ entity.userId }}
            </div>
          </div>


          <div class="">

            <div class="s-font-xs text-grey">АИС:</div>

            <div class="">
              {{ entity.ais.aisId ? entity.ais.aisId : 'нет' }}
            </div>

          </div>

          <div class="">
            <div class="s-font-xs text-grey">Дело на фак:</div>
            <div class="">
              {{ $util.base.deepGet(entity, 'institute.name') }}
            </div>
          </div>

          <q-space/>

          <div class="">

            <div class="s-font-xs text-grey text-no-wrap">Док. образования:</div>

            <template v-if="!entity.podldocAny">
              не подлинник
            </template>
            <div v-else class="bg-green q-px-sm text-white">

              <ul class="q-pl-sm">
                <li v-if="entity.podldoc" class="text-no-wrap">
                  Печатный оригинал
                </li>
                <li v-if="entity.podldocEpgu" class="text-no-wrap">
                  ЕПГУ оригинал
                </li>
              </ul>

            </div>

          </div>

          <div class="q-ml-xl">

            <div
                class="s-badge"
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
        <q-tab label="Испытания" name="tests"/>
        <q-tab label="Заявления" name="apps"/>
        <q-tab label="Достижения" name="achievements"/>
        <q-tab label="Документы" name="docs"/>
        <q-tab label="История" name="history" v-if="false"/>
        <q-tab label="Чат" name="chat"/>
        <q-tab label="ЕПГУ" name="epgu"/>
        <q-tab label="В старом ЛК" name="port"/>
        <q-tab label="Системное" name="system"/>

      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated class="bg-transparent" keep-alive>

        <q-tab-panel class="q-px-none" name="common">
          <CTabPersonal
              ref="personal"
              :changed.sync="changed.personal"
              :order="entity"
              @refetch="refetch"
              @saved="onTabSaved"
              :edit="edit"
          />
        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="tests">
          <CTabTests
              ref="tests"
              :changed.sync="changed.tests"
              :items="entity.tests"
              :order="entity"
              @refetch="refetch"
              @saved="onTabSaved"
          />
        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="achievements">
          <CTabAchievements
              ref="achievements"
              :changed.sync="changed.achievements"
              :items="entity.anket.entrance.achievements"
              :order="entity"
              @refetch="refetch"
              @saved="onTabSaved"
          />
        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="apps">
          <CTabApps
              ref="apps"
              :changed.sync="changed.apps"
              :items="entity.appGroups"
              :order="entity"
              @refetch="refetch"
              @saved="onTabSaved"
          />
        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="docs">
          <CTabDocs
              ref="docs"
              :changed.sync="changed.docs"
              :items="entity.docs"
              :order="entity"
              @refetch="refetch"
              @saved="onTabSaved"
          />
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

        <q-tab-panel class="q-px-none" name="epgu">
          <CTabEpgu
              :order="entity"
          />
        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="port">

          <CTabPort
              :order="entity"
          />

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="system">

          <div class="row q-col-gutter-x-md q-col-gutter-y-lg q-mb-lg">

            <div class="col-24 col-lg-12 ">
              <div class="com s-info-section">
                <div class="__header">Данные</div>
                <q-list class="__items">
                  <q-item class="__item">
                    <q-item-section class="__title">_id</q-item-section>
                    <q-item-section class="__value " side>
                      {{ entity._id }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>

            <div class="col-24 col-lg-12 ">
              <div class="com s-info-section">
                <div class="__header">АИС</div>
                <json-viewer :value="entity.ais"/>
              </div>
            </div>

          </div>


        </q-tab-panel>

      </q-tab-panels>

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

import CTabPersonal from './order-view/tab-personal'
import CTabEpgu from './order-view/tab-epgu'
import CTabDocs from './order-view/tab-files'
import CTabTests from './order-view/tab-tests'
import CTabApps from './order-view/tab-apps'
import CTabAchievements from './order-view/tab-achievments'
import CTabPort from './order-view/tab-port'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    edit: {}
  },
  components: {
    CTabPersonal,
    CTabEpgu,
    CTabDocs,
    CTabTests,
    CTabApps,
    CTabAchievements,
    CTabPort
  },
  data() {
    return {
      v: 'ss',
      entityIdState: this.entityId,
      tab: 'common',

      dialogIs: 'ui-admin-dialog',

      saved: false,
      changed: {
        personal: false,
        apps: false,
        docs: false,
        achievements: false,
        tests: false,
      },

      persistent: false
    }
  },
  computed: {

    entityNid() {
      return this.entity ? this.entity.nid : null
    },

    entranceData() {
      return this.entity.anket.entrance
    },

    canEditPersonal() {
      return true
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



    haveChanges() {
      return !!Object.keys(this.changed).find(name => this.changed[name])
    }
  },
  created() {
    this.fetch()
  },

  methods: {
    onActionSuccess() {
      this.refetch()
    },

    onBeforeHide() {
      if (this.saved) {
        console.log('onBeforeHide')
        this.$bus.emit('reload-panel', 'orders-list')
      }
    },

    onTabSaved() {
      console.log('onTabSaved')
      this.saved = true
    },

    onShake() {

      this.$q.dialog({
        title: 'Заяление не сохранено',
        message: 'Все равно закрыть?',
        cancel: true,
      }).onOk(async () => {
        this.persistent = false
        this.visible = false
      })

    },
    onEntranceAdd() {
      this.entranceData.subjects.push({})
    },
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
    async refetch() {
      await this.fetch(true)
    },
    async fetch(refetch) {
      await this.fetchingMethod(async () => {
        this.entity = !refetch && this.entityData || await this.$store.dispatch('edu_order/entityQuerySingle',  this.entityId)
        this.appsChanged = false
      })
    },

  },
  watch: {
    haveChanges(v) {
      this.persistent = v
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
