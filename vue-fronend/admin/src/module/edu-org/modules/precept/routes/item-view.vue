<template>

  <component
    v-if="entity"
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actionsClose="true"
    :loading="fetching"
    :title="'Приказ'"
    dialogWidth="900px"
    @hide="onHide"
  >

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
      <q-tab label="Экспорт" name="export"/>
    </q-tabs>

    <q-separator/>

    <q-tab-panels v-model="tab" animated>

      <q-tab-panel class="q-px-none" name="common">


      </q-tab-panel>

      <q-tab-panel class="q-px-none" name="apps">


        <q-markup-table
          class="s-table-data"
          flat
        >
          <thead>
            <tr>
              <td>№</td>
              <td>№ ЕПГУ</td>
              <td>ФИО</td>
              <td>Направление</td>
              <td>Источник</td>
              <td>Согласие</td>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(app, index) of entity.appsAdd" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ app.epguId }}</td>
            <td>{{ app.fio }}</td>
            <td>{{ app.admission.name }}</td>
            <td>{{ app.source.name }}</td>
            <td>{{ app.agreement ? 'да' : '' }}</td>
          </tr>
          </tbody>
        </q-markup-table>

      </q-tab-panel>

      <q-tab-panel class="q-px-none" name="export">

        <q-input
          v-model="exportDataProxy"
          input-style="height: 80vh; white-space: nowrap;"
          label="Payload"
          outlined
          type="textarea"
        />

      </q-tab-panel>


    </q-tab-panels>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {},
  components: {},
  data() {
    return {
      tab: 'apps',
    }
  },
  computed: {
    exportDataProxy: {
      get: function () {
        const val = this.$util.base.cloneDeep(this.entity.exportData)
        return JSON.stringify(val, null, 2)
      },
      set: function (val) {
        this.entity.exportData = JSON.parse(val)
      }
    },
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      await this.fetchingMethod(async () => {
        this.entity = this.entity || await this.$store.dispatch('edu_precept/querySingle', this.entityId)
      })
    },
  },

  watch: {

  }
}

</script>

<style lang="scss" scoped>


</style>
