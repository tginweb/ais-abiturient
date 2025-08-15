<template>

  <div>


    <div class="s-form-group s-form-section-controls" style="max-width: 900px;">

      <div class="q-mb-md">
        Заявления отсортированы по приоритету. Для смены приоритета нажмите по номеру приоритета.
      </div>

      <q-btn
          :disabled="!!priorityChanged"
          :icon="$icons.plus"
          class="q-px-lg s-font-lg"
          color="secondary"
          label="Добавить конукрс"
          rounded
          @click="onApplicationAdd"
      />

      <div v-if="priorityChanged" class="text-green q-mt-sm">
        Расставьте и сохраните приоритеты перед добавлением конкурса
      </div>


      <div
          v-for="appGroup of appGroupsComputed"
          :key="appGroup.id"
          class="c-applications q-mb-xl"
      >
        <h5>
          Заявление на {{ appGroup.isBudget ? 'БЮДЖЕТ' : 'КОММЕРЧЕСКИЙ' }}
        </h5>

        <template v-if="!!appGroup.appsActive.length">

          <div
              v-for="item of appGroup.appsActive"
              :key="item._id"
              class="__item q-pa-md q-pa-md-lg q-mb-lg"
          >
            <div class="row  items-center q-col-gutter-sm q-col-gutter-md-lg">

              <div class="col-24 col-md-4">

                <q-select
                    v-if="orderState.eduTypeAppsLimit > 1"
                    v-model="item.priority"
                    :options="[1,2,3,4,5]"
                    behavior="menu"
                    color="grey-3"
                    dense
                    emit-value
                    hide-dropdown-icon
                    label="Приоритет"
                    map-options
                    outlined
                    @input="onChangePriority"
                />

              </div>

              <div class="col-24 col-md-18 ">

                <div class="q-gutter-y-sm">

                  <div class="row no-wrap1 items-start" style="position: relative;">

                    <div class="__item__title text-grey-9 q-mr-auto q-pr-sm s-font-md s-font-md-lg">

                      {{ item.competition.admission.direct_name }}

                      {{ item.competition.admission.direction && item.admission.direction.cod }}

                      ({{ item.competition.admission.abbr }}),

                      {{ item.competition.admission.fob.name }}

                    </div>

                  </div>

                  <div class="row no-wrap-sm">

                    <div class="col-24 col-sm-5 text-grey-7  fname">Конкурс:</div>
                    <div class="col-24 col-sm-19">{{ item.competition.source.name }}</div>

                  </div>

                  <div v-if="!!item.competition.celevOrgName" class="row no-wrap-sm">

                    <div class="col-24 col-sm-5 text-grey-7 fname">Целевая организация:</div>
                    <div class="col-24 col-sm-19">{{ item.competition.celevOrgName }}</div>

                  </div>


                  <div class="row items-center">

                    <div class="col-24 col-sm-5 text-grey-7 fname">Статус:</div>

                    <div class="col-24 col-sm-7 flex">

                      {{ item.statusTitle }}

                    </div>


                    <div class="col-24 col-sm-5 text-grey-7 fname">Подано через:</div>

                    <div class="col-24 col-sm-7 text-green flex">

                      <template v-if="item.cappsource === 'epgu'">
                        Гос. услуги
                      </template>
                      <template v-else>
                        кабинет ИРНИТУ
                      </template>

                    </div>

                  </div>


                </div>


              </div>

              <div class="col-24 col-md-2 text-right">
                <q-btn
                    :label="$q.screen.lt.md ? 'удалить':null"
                    :size="$q.screen.gt.md ? '14px' : '12px'"
                    color="red"
                    dense
                    flat
                    icon="far fa-trash-alt"
                    title="Удалить (отозвать) заявление"
                    @click="onApplicationDelete(item)"
                />
              </div>
            </div>

          </div>

        </template>

        <template v-if="!!appGroup.appsCanceled.length">

          <q-expansion-item
              v-if="appGroup.appsCanceled.length"
              v-model="canceledExpanded"
              :label="'Отклоненные конкурсы  - ' + appGroup.appsCanceled.length"
              class="q-mt-xs"
              header-class="text-red"
              switch-toggle-side
          >
            <q-markup-table
                bordered
                class="s-font-2xs full-width text-center"
                dense
                flat
            >
              <thead>
              <tr>
                <th class="bg-blue-grey-5 text-white">
                  ПР
                </th>
                <th class="bg-blue-grey-5 text-white">
                  Набор
                </th>
                <th class="bg-blue-grey-5 text-white">
                  Конкурс
                </th>
                <th class="bg-blue-grey-5 text-white">
                  Организация
                </th>
                <th class="bg-blue-grey-5 text-white">
                  Статус
                </th>
              </tr>

              </thead>
              <tbody>
              <tr v-for="app of appGroup.appsCanceled">

                <td>
                  {{ app.priority }}
                </td>

                <td>{{ $util.base.deepGet(app, 'competition.admission.abbr') }}</td>

                <td>{{ $util.base.deepGet(app, 'competition.source.name') }}</td>

                <td style="white-space: normal;">{{ $util.base.deepGet(app, 'competition.celevOrgName') }}</td>

                <td>
                  {{ app.statusTitle }}
                </td>

              </tr>
              </tbody>
            </q-markup-table>

          </q-expansion-item>


        </template>

      </div>

      <div v-if="priorityChanged" class="q-py-lg bg-white q-px-md q-mb-lg"
           style="position: sticky; bottom: 0;border:1px solid #ddd;">

        <div class="flex items-center no-wrap">

          <div class="q-pr-lg">
            <div v-if="priorityError" class="text-red">
              Ошибка: {{ priorityError }}
            </div>
            <div v-else class="text-yellow-9">
              Внимание: изменены приоритеты, необходимо сохранить
            </div>
          </div>

          <div class="q-ml-auto">
            <q-btn
                :disable="!!priorityError"
                color="primary"
                label="Сохранить приоритеты"
                no-wrap
                size="18px"
                @click="onPrioritySave"
            />
          </div>

        </div>

      </div>

      <q-btn
          v-if="!priorityChanged && appsActive.length"
          class="s-font-lg q-ml-lg-auto"
          color="primary"
          icon="fas fa-arrow-right"
          label="Далее"
          rounded
          to="/cab/order/step/upload"
      />


    </div>

  </div>

</template>

<script>


export default {
  components: {},
  props: {
    order: {}
  },
  data() {
    return {
      orderState: this.order,
      appGroups: this.$util.base.cloneDeep(this.order.appGroups),
      canceledExpanded: false,
      priorityChanged: false
    }
  },

  watch: {
    'order.appGroups'(v) {
      this.appGroups = this.$util.base.cloneDeep(v)
    }
  },

  created() {
    this.$store.dispatch('edu_order/userOrderEnsureAdmissions')
  },
  mounted() {
    this.appGroups = this.appGroups.map((appGroup => {
      return {
        ...appGroup,
        apps: this.reindexApplications(appGroup.appsActive)
      }
    }))

    if (this.priorityError) {
      this.priorityChanged = true
    }
  },
  methods: {

    async onPrioritySave() {
      const res = await this.$store.dispatch('gql/mutation', {
        mutation: require('~module/edu-org/modules/order/gql/order/mutation/apps_arrange.gql'),
        variables: {
          items: this.appGroups
        },
      })
      if (res.result.success) {
        this.priorityChanged = false
      }
    },

    async onChangePriority() {

      this.priorityChanged = true

      this.appGroups = this.appGroups.map((appGroup => {
        return {
          ...appGroup,
          apps: this.reindexApplications(appGroup.appsActive)
        }
      }))
    },

    async onApplicationDelete(app) {

      this.$q.dialog({
        title: 'Подтвердите удаление',
        message: 'Вы действительно хотите удалить заявление?',
        cancel: true,
        persistent: true
      }).onOk(async () => {

        try {

          let {data: {res}} = await this.$apollo.mutate({
            mutation: require('~module/edu-org/modules/order/gql/order/mutation/app_delete.gql'),
            variables: {
              id: app.id,
            },
          })

          await this.$store.dispatch('edu_order/userOrderFetch')

          this.$bus.emit('processMessages', res.result.messages)

        } catch (e) {

          console.log(e)

        }
      })
    },

    onApplicationAdd() {
      this.$router.push({
        name: 'edu.order:app-add'
      })
    },

    reindexApplications(items) {
      return items.sort((a, b) => (a.priority > b.priority) ? 1 : -1)
    },

  },

  computed: {
    priorityError() {

      for (const appGroup of this.appGroups) {
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

          if (app.priority === prevPriority + 1 || app.priority === prevPriority) {

          } else {
            return pref + 'Неверный порядок приоритета №' + app.priority + ': номера приоритетов должны идти друг за другом (1,2,3 и тд) или повторяться для одинкового направления (1,1,2,3 и тд)'
          }

          prevPriority = app.priority
        }

        for (const [cadmission, priorityMap] of Object.entries(cadmissions)) {
          if (Object.keys(priorityMap).length > 1) {
            return pref +  'Приоритеты по одному направлению подготовки должны совпадать. Ошибка по направлению: ' + Object.values(priorityMap)[0].direct_name
          }
        }

        for (const [priority, map] of Object.entries(priorities)) {
          if (Object.keys(map).length > 1) {
            return pref +  'К одному приоритету можно отнести только одного направление подготовки. Ошбика в приоритету №' + priority
          }
        }

      }
    },

    appGroupsComputed() {
      return this.appGroups.map(appGroup => ({
        ...appGroup,
        appsActive: [...appGroup.appsActive].sort(function (a, b) {
          return parseInt(a.priority) - parseInt(b.priority)
        })
      }))
    },
    appsActive() {
      const result = []
      this.appGroupsComputed.forEach((appGroup) => {
        appGroup.appsActive.forEach(app => {
          result.push(app)
        })
      })
      return result
    },
    storeOrder() {
      return this.$store.getters['edu_order/userOrder']
    }
  }
}
</script>


<style lang="scss" scoped>

.c-applications {

  .__item {
    border: 2px solid $primary;
    border-radius: 20px;

  }

  .__item__title {
    font-weight: 600;
  }
}

.fname {
  width1: 135px;
}

</style>
