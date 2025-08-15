<template>

  <component
    v-if="entity"
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actionsClose="true"
    :loading="fetching"
    :title="'Абитуриент'"
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
      <q-tab label="Экспорт" name="appsExport"/>
      <q-tab label="Экспорт XML" name="appsExportXml"/>
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
              <td>СНИЛС</td>
              <td>АИС ID</td>
              <td>ЕПГУ ID</td>
              <td>ФИО</td>
              <td>Тесты</td>
              <td>ИД</td>
              <td>Балл</td>
              <td>Согласие</td>
              <td>Без ВИ</td>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(app, index) of entity.apps" :key="index">
            <td>{{ app.rating }}</td>
            <td>{{ app.snils }}</td>
            <td>{{ app.aisId }}</td>
            <td>{{ app.epguId }}</td>
            <td>{{ app.fio }}</td>
            <td>

              <ul class="q-ma-none q-pr-lg">
                <li v-for="(test, testIndex) of app.entranceTests" :key="testIndex">
                  <nobr>{{test.name}} - {{test.mark}}</nobr>
                </li>
              </ul>

            </td>
            <td>{{ app.ballAchievement }}</td>
            <td>{{ app.ball }}</td>
            <td>{{ app.agreement ? 'да' : '' }}</td>
            <td>{{ app.withoutTests ? 'без ВИ' : '' }}</td>
          </tr>
          </tbody>
        </q-markup-table>

      </q-tab-panel>

      <q-tab-panel class="q-px-none" name="appsExport">

        <q-input
          v-model="appsExportProxy"
          input-style="height: 80vh; white-space: nowrap;"
          label="Payload"
          outlined
          type="textarea"
        />

      </q-tab-panel>

      <q-tab-panel class="q-px-none" name="appsExportXml">

        <q-input
          v-model="entity.appsExportXml"
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
      dialogIs: 'ui-admin-dialog',
      tab: this.$store.getters['edu_ss_entrant/viewDefaultTab'],
      epguDocsSelectAll: false,
    }
  },
  computed: {
    appsExportProxy: {
      get: function () {
        const val = this.$util.base.cloneDeep(this.entity.appsExport)
        return JSON.stringify(val, null, 2)
      },
      set: function (val) {
        this.entity.appsExport = JSON.parse(val)
      }
    },
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      await this.fetchingMethod(async () => {
        this.entity = this.entity || await this.$store.dispatch('edu_ss_competition_list/listQuerySingle', this.entityId)
      })
    },
  },

  watch: {
    tab(val) {
      this.$store.commit('edu_ss_entrant/VIEW_DEFAULT_TAB', val)
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
