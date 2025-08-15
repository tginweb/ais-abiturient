<template>

  <div>


    <div class="q-gutter-x-md flex q-mb-lg q-mt-sm">

      <q-btn
          color="primary"
          icon="fas fa-plus"
          label="добавить конкурс"
          outline
          size="md"
          @click="onAdd()"
      />
      <q-space/>

      <q-btn
          v-if="changed"
          :disable="changedPriority && !!priorityError"
          color="primary"
          icon="save"
          label="Сохранить изменения"
          size="md"
          @click="onSave"
      />

      <q-btn
          v-if="changed"
          color="red"
          icon="do_not_disturb_on"
          label="Сбросить изменения"
          outline
          size="md"
          @click="onReset"
      />

    </div>

    <div v-if="!appGroupsComputed.length">
      нет добавленных конкурсных групп
    </div>
    <div v-else class="">

      <div v-if="priorityError" class="text-red q-mb-md">
        {{ priorityError }}
      </div>

      <div
          v-for="appGroup of appGroupsComputed"
          :key="appGroup.id"
          class="com s-info-section q-mb-lg"
      >

        <div class="row q-col-gutter-md">

          <div class="col-3 text-center">

            <div class="s-font-xl">
              {{ appGroup.isBudget ? 'БЮДЖЕТ' : 'ПЛАТНОЕ' }}
              {{ appGroup.isDopnabor ? 'ДОПНАБОР' : ''}}
            </div>

          </div>

          <div class="col-21">

            <q-markup-table
                bordered
                class="s-font-2xs full-width text-center s-table c-apps"
                dense
                flat
            >
              <thead>
              <tr>

                <th style="width: 30%;">
                  Конкурс
                </th>
                <th style="width: 5%;">
                  Приоритет
                </th>
                <th style="width: 12%;">
                  Текущий статус
                </th>
                <th v-if="statusEdit" style="width: 20%;">
                  Сменить статус
                </th>
                <th v-if="statusEdit">

                </th>

                <th style="width: 20%;">
                  БВИ
                </th>
                <th>
                  Источник
                </th>
                <th>
                  ЛК
                </th>
                <th>
                  АИС
                </th>
                <th>
                  ЕПГУ
                </th>
                <th>

                </th>
                <th>
                  Конкурс ID
                </th>
              </tr>

              </thead>
              <tbody>
              <tr v-for="app of appGroup.appsActive">

                <td>
                  <div
                      v-if="$util.base.deepGet(app, 'competition.admission.abbr')"
                      class="cursor-pointer s-link"
                      style="display:inline-block;"
                      @click="onCompetitionOpen(app)"
                  >
                    {{ $util.base.deepGet(app, 'competition.name') }}
                  </div>
                </td>

                <td>

                  <div>
                    {{ app.priority }}
                  </div>

                  <q-popup-edit
                      v-slot="scope"
                      :validate="onValidatePriority"
                      :value="app.priority"
                      buttons
                      @save="onPriorityUpdate(app,$event)"
                  >
                    <q-input
                        v-model="scope.value"
                        autofocus
                        dense
                        type="number"
                        @keyup.enter="scope.set"
                    >
                    </q-input>
                  </q-popup-edit>

                </td>

                <td
                    :class="{
                      'status-member': app.statusIdNew === 8 || app.statusId === 8,
                      'status-pending': app.statusIdNew === 4 || app.statusId === 4
                    }"
                    class="cursor-pointer"
                >
                  <div
                      class="q-py-xs"
                      href="#"
                      style="font-weight: bold;color: #111;"
                      @click.prevent="statusEdit=true"
                  >{{ app.statusTitle }}
                  </div>
                </td>

                <td v-if="statusEdit || app.statusIdNew">
                  <q-select
                      @input="onStatusInput(app, $event)"
                      :value="app.statusIdNew"
                      :options="[...app.availableStatusList.map(id => $store.getters['edu_app/statusesById'][id])]"
                      emit-value
                      map-options
                      option-label="title"
                      option-value="id"
                      outlined
                      clearable
                  />
                </td>
                <td v-if="statusEdit || app.statusIdNew">
                  <q-select
                      v-if="(app.statusIdNew === 12)"
                      v-model="app.cancelReasonId"
                      :options="$store.state.edu_app.app.cancelReasons"
                      clearable
                      emit-value
                      label="Причина отказа"
                      map-options
                      option-label="name"
                      option-value="id"
                      outlined
                      style="width: 200px"
                      @input="changed = true"
                  />
                </td>

                <td>
                  <q-checkbox
                      :value="app.bvi"
                      @click.native="onBvi(app)"
                  />
                </td>

                <td>
                  {{ app.createSourceTitle }}
                </td>
                <td>
                  <div
                      v-if="app.lk.priority"
                      :class="{
                        's-priority-warn': app.lk.priority !== app.priority
                      }"
                      class="text-center"
                  >
                    {{ app.lk.priority }}
                  </div>
                </td>
                <td>
                  <div
                      v-if="app.ais.priority"
                      :class="{
                        's-priority-warn': app.ais.priority !== app.priority
                      }"
                      class="text-center"
                  >
                    {{ app.ais.priority }}
                  </div>
                </td>
                <td>
                  <div
                      v-if="app.epgu.priority"
                      :class="{
                        's-priority-warn': app.epgu.priority !== app.priority
                      }"
                      class="text-center"
                  >
                    {{ app.epgu.priority }}
                  </div>
                </td>
                <td>
                  {{app.competition.uid}}
                </td>
                <td>
                  {{app.competition.id}}
                </td>
              </tr>
              </tbody>
            </q-markup-table>


            <q-expansion-item
                v-if="appGroup.appsCanceled.length"
                v-model="canceledExpanded[appGroup.id]"
                :label="'Отклоненные конкурсы  - ' + appGroup.appsCanceled.length"
                class="q-mt-md"
                header-class="text-red s-font-lg text-bold"
                switch-toggle-side
            >
              <q-card>
                <q-card-section>
                  <q-markup-table
                      bordered
                      class="s-font-2xs text-center s-table"
                      dense
                      flat
                      style="overflow: scroll"
                  >
                    <thead>
                    <tr>
                      <th style="width: 10%;">
                        Набор
                      </th>
                      <th style="width: 30%;">
                        Конкурс
                      </th>
                      <th style="width: 20%;">
                        Орг
                      </th>
                      <th style="width: 3%;">
                        БВИ
                      </th>
                      <th style="width: 5%;">
                        Приоритет
                      </th>
                      <th style="width: 12%;">
                        Текущий статус
                      </th>
                      <th></th>
                      <th></th>
                    </tr>

                    </thead>
                    <tbody>
                    <tr v-for="app of appGroup.appsCanceled">

                      <td>{{ $util.base.deepGet(app, 'competition.admission.abbr') }}</td>

                      <td>{{ $util.base.deepGet(app, 'competition.source.name') }}</td>

                      <td style="white-space: normal;">{{ $util.base.deepGet(app, 'competition.celevOrgName') }}</td>

                      <td>
                        <q-checkbox
                            :value="app.bvi"
                            disable
                        />
                      </td>

                      <td>
                        <div>
                          {{ app.priority }}
                        </div>
                      </td>

                      <td class="status-canceled">
                        {{ app.statusTitle }}
                      </td>

                      <td>
                        <q-select
                            v-if="(app.statusId === 12)"
                            v-model="app.cancelReasonId"
                            :options="$store.state.edu_app.app.cancelReasons"
                            clearable
                            emit-value
                            label="Причина отказа"
                            map-options
                            option-label="name"
                            option-value="id"
                            outlined
                            style="min-width: 400px"
                            @input="changed = true"
                        />
                      </td>

                      <td>
                        <q-input
                            v-if="(app.statusId === 12)"
                            type="textarea"
                            outlined
                            rows="4"
                            v-model="app.cancelReasonMessage"
                            label="Причина отказа - сообщение"
                            @input="changed = true"
                            style="min-width: 400px"
                        />
                      </td>
                      <td>
                        {{app.competition.uid}}
                      </td>
                    </tr>
                    </tbody>
                  </q-markup-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>


          </div>

        </div>

      </div>
    </div>

  </div>

</template>

<script>

import CParent from './tab'
import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep";

export default {
  extends: CParent,
  props: {
    items: {},
  },
  components: {},
  data() {
    return {
      itemsState: cloneDeep(this.items),
      statusEdit: false,
      canceledExpanded: {},
      changedPriority: false
    }
  },
  computed: {
    appGroupsComputed() {
      return [...this.itemsState.map(appGroup => ({
        ...appGroup,
        appsActive: [...appGroup.appsActive].sort(function (a, b) {
          return parseInt(a.priority) - parseInt(b.priority)
        })
      }))].sort((a, b) => {
        if (a.isDopnabor) {
          return -1
        }
        return (a.isBudget === b.isBudget) ? 0 : a.isBudget ? -1 : 1
      })
    },

    priorityError() {

      for (const appGroup of this.appGroupsComputed) {
        const cadmissions = {}
        const priorities = {}

        const pref = appGroup.isBudget ? 'В БЮДЖЕТНОМ - ' : 'В КОММЕРЧЕСКОМ - '

        let prevPriority = 0
        for (const app of appGroup.appsActive) {

          if (!cadmissions[app.cadmission]) {
            cadmissions[app.cadmission] = {}
          }
          if (!priorities[app.priority]) {
            priorities[app.priority] = {}
          }
          cadmissions[app.cadmission][app.priority] = app.competition.admission
          priorities[app.priority][app.cadmission] = app.competition.admission

          console.log([prevPriority, app.priority])

          /*
          if (app.priority === prevPriority + 1 || app.priority === prevPriority) {

          } else {
            return pref + 'Неверный порядок приоритета №' + app.priority + ': номера приоритетов должны идти друг за другом (1,2,3 и тд) или повторяться для одинкового направления (1,1,2,3 и тд)'
          }
           */

          prevPriority = app.priority
        }

        for (const [cadmission, priorityMap] of Object.entries(cadmissions)) {
          if (Object.keys(priorityMap).length > 1) {
            return pref + 'Приоритеты по одному направлению подготовки и форме обучения должны совпадать. Ошибка по направлению: ' + Object.values(priorityMap)[0].direct_name + ' ' + Object.values(priorityMap)[0].abbr
          }
        }

        for (const [priority, map] of Object.entries(priorities)) {
          if (Object.keys(map).length > 1) {
            return pref + 'К одному приоритету можно отнести только одного направление подготовки. Ошбика в приоритету №' + priority
          }
        }

      }
    },

  },
  created() {

  },
  methods: {

    onStatusInput(app, statusId) {

      let confirm

      switch (statusId) {
        case 11:
          confirm = 'Вы действительно хотите включить заявление в приказ?'
          break;
      }

      if (confirm) {
        this.$q.dialog({
          title: confirm,
          cancel: true,
        }).onOk(async () => {
          this.$set(app, 'statusIdNew', statusId)
          this.changed = true
        })
      } else {
        this.$set(app, 'statusIdNew', statusId)
        this.changed = true
      }


    },

    onCompetitionOpen(app) {
      this.$router.push('/admin/edu/competition/' + app.competition._id + '/view')
    },
    onBvi(app) {

      this.$q.dialog({
        title: 'Уверены что хотите изменить статус Без вступительных?',
        cancel: true,
      }).onOk(async () => {
        app.bvi = !app.bvi
        this.changed = true
      })
    },
    onAdd() {
      this.$router.push({
        name: 'edu.order:apps-add',
        params: {
          entityId: this.order._id,
          entityData: this.order,
          onResolve: () => {
            this.reload()
          }
        }
      })
    },
    async onSaveCommit() {
      const data = {}

      for (const appGroup of this.itemsState) {

        data[appGroup.id] = []

        appGroup.appsActive.forEach((app) => {
          data[appGroup.id].push({
            id: app.id,
            priority: app.priority,
            statusIdNew: app.statusIdNew,
            bvi: app.bvi,
            cancelReasonId: app.cancelReasonId,
            cancelReasonMessage: app.cancelReasonMessage
          })
        })

        appGroup.appsCanceled.forEach((app) => {
          data[appGroup.id].push({
            id: app.id,
            priority: app.priority,
            bvi: app.bvi,
            cancelReasonId: app.cancelReasonId,
            cancelReasonMessage: app.cancelReasonMessage
          })
        })
      }

      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/order/mutation/appsSave.gql'),
          variables: {
            id: this.order._id,
            data: data
          }
        })
        if (res.result.success) {
          this.unsetChanged()
          this.$emit('saved')
          this.reload()
        }
      } catch (e) {
        console.log(e)
      }

    },
    onSave() {
      this.onSaveCommit()
    },
    onValidatePriority(v) {
      return parseInt(v) > 0
    },
    onPriorityUpdate(app, priority) {
      app.priority = parseInt(priority)
      this.changed = true
      this.changedPriority = true
    },
    unsetChanged() {
      this.itemsState = cloneDeep(this.items)
      this.statusEdit = false
      this.changed = false
      this.changedPriority = false
    },
  },
  watch: {
    items(v) {
      this.itemsState = cloneDeep(v)
    },
  }
}

</script>

<style lang="scss" scoped>

.s-priority-warn {
  font-weight: bold;
  text-align: center;
  background-color: #9a3314;
  color: #FFFF;
}

.status-member {
  background-color: #bfe7cb;
}

.status-pending {
  background-color: #eee1bb;
}

.status-canceled {
  background-color: #eebcb5;
}

.c-apps {
  td {
    vertical-align: middle;
  }
}

</style>
