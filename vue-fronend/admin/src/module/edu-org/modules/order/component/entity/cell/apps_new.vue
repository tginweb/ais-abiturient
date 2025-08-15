<template>

  <div class="q-gutter-y-md" :key="version">

    <template
        v-for="appGroup of order.appGroups"
    >
      <div
          :key="appGroup.id"
          v-if="appGroup.appsActive.length || appGroup.appsCanceled.length"
      >
        <div class="flex">
          <div>
            <b>
              {{ appGroup.isBudget ? 'БЮДЖЕТ' : 'КОММЕРЧЕСКИЙ' }}
              {{ appGroup.isDopnabor ? 'ДОПНАБОР' : ''}}
            </b>
          </div>
          <div class="q-ml-auto text-grey-8">
            № {{appGroup.nid}}
            <span v-if="appGroup.epguGuid">
            [ЕПГУ: {{appGroup.epguGuid}}]
          </span>
          </div>
        </div>

        <q-markup-table
            bordered
            class="s-font-2xs full-width text-center"
            dense
            flat
        >
          <thead>
          <tr>
            <th class="bg-blue-grey-5 text-white" rowspan="2">
              ПР
            </th>
            <th class="bg-blue-grey-5 text-white" rowspan="2">
              Конкурс
            </th>
            <th class="bg-blue-grey-5 text-white" rowspan="2">
              Статус
            </th>
            <th class="bg-blue-grey-5 text-white" rowspan="2">
              Источник
            </th>

            <th class="bg-blue-grey-5 text-white" colspan="1">
              ЛК
            </th>
            <th class="bg-blue-grey-5 text-white" colspan="1">
              АИС
            </th>
            <th class="bg-blue-grey-5 text-white" colspan="2">
              ЕПГУ
            </th>
            <th class="bg-blue-grey-5 text-white">
              nid
            </th>
          </tr>
          <tr>

            <th class="bg-blue-grey-5 text-white">
              Пр
            </th>
            <th class="bg-blue-grey-5 text-white">
              Пр
            </th>
            <th class="bg-blue-grey-5 text-white">
              Пр
            </th>
            <th class="bg-blue-grey-5 text-white">
              ЕПГУ Статус
            </th>
            <th class="bg-blue-grey-5 text-white">

            </th>

          </tr>
          </thead>
          <tbody>
          <tr
              v-for="app of ([...appGroup.appsActive].sort((a, b) => ((a.priority > b.priority) ? 1 : -1)) || [])"
              :key="app._id"
          >

            <td>
              {{ app.priority }}
            </td>

            <td>{{ $util.base.deepGet(app, 'competition.name') }}</td>

            <td>
              {{ app.statusTitle }}
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
              {{ app.epgu.status && app.epgu.status.title }}
            </td>
            <td>
              {{app.nid}}
            </td>
          </tr>

          </tbody>
        </q-markup-table>

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
                Конкурс
              </th>
              <th class="bg-blue-grey-5 text-white">
                Статус
              </th>
              <th class="bg-blue-grey-5 text-white">
                ЛК
              </th>
              <th class="bg-blue-grey-5 text-white">
                АИС
              </th>
              <th class="bg-blue-grey-5 text-white">
                ЕПГУ
              </th>
            </tr>


            </thead>
            <tbody>
            <tr v-for="app of appGroup.appsCanceled">

              <td>
                {{ app.priority }}
              </td>

              <td>{{ $util.base.deepGet(app, 'competition.name') }}</td>

              <td>
                {{ app.statusTitle }}
              </td>
              <td>
                {{ app.lk.priority }}
              </td>
              <td>
                {{ app.ais.priority }}
              </td>

              <td>
                {{ app.epgu.priority }}
              </td>

            </tr>
            </tbody>
          </q-markup-table>

        </q-expansion-item>

      </div>

    </template>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  data() {
    return {
      canceledExpanded: false,
      version: 1
    }
  },
  computed: {
    order() {
      return this.row.order || this.row
    },
    apps() {
      return this.$util.base.orderBy(this.row.apps, 'priority', 'asc')
    }
  },
  methods: {
    time() {
      return Date.now().toString()
    }
  },
  watch: {
    row: {
      handler: function (val) {
        this.version++
      },
      deep: true
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
</style>
