<template>

  <component
      v-model="visible"
      :loading="fetching"
      :scroll-height.sync="scrollHeight"
      dialogWidth="1350px"
      title="Добавить тесты"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >

    <q-tabs
        v-model="tab"
        active-bg-color="secondary"
        active-color="white"
        align="justify"
        class=" text-primary"
        dense
        indicator-color="white"
        narrow-indicator
    >
      <q-tab label="Из списка" name="list"/>
      <q-tab label="Из результата Excel" name="result_excel"/>
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel class="q-px-none" name="list">
        <ui-data-panel
            ref="panel"
            :data.sync="entities"
            :filters-enable="true"
            :table-height="(scrollHeight-0)+'px'"
        />
      </q-tab-panel>
      <q-tab-panel class="q-px-none" name="result_excel">

        <div class="q-mb-lg">
          <q-input
              v-model="entity.excelText"
              :rows="6"
              class="q-mb-md"
              label="Excel"
              outlined
              type="textarea"
          >
            <template v-slot:append>
              <div>
                <q-btn
                    color="primary"
                    label="Обработать"
                    @click="convertExcel"
                />
                <q-btn
                    color="primary"
                    label="Загрузить"
                    @click="onLoad"
                />
              </div>
            </template>
          </q-input>
        </div>

        <div class="q-mb-xl">

          <q-scroll-area style="max-width: 100%;height:500px">

            <q-markup-table class="s-table bordered">
              <thead>
              <tr>
                <th v-for="name in excelTable.headers" style="white-space:normal;max-width:190px;">
                  <div style="text-overflow:ellipsis;overflow: hidden;">
                    {{ name }}
                  </div>
                </th>
                <th>Абитуриент</th>
                <th></th>
                <th>Предмет</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in excelTable.rows">
                <td v-for="(val, name) of row.fields" style="white-space:normal;max-width:250px;">
                  <div v-if="name==='aisid'">
                    <q-input
                        v-model="row.fields.aisid"
                        label="aisId"
                        outlined
                        style="width: 240px;"
                    />
                  </div>
                  <div v-else style="text-overflow:ellipsis;overflow: hidden;">
                    {{ val }}
                  </div>
                </td>
                <td>
                  <div v-if="row.order === false">
                    --
                  </div>
                  <div v-else-if="row.order">
                    <CPerson :order="row.order"/>
                  </div>
                </td>
                <td>
                  <div v-if="row.order === false">
                    --
                  </div>
                  <div v-else-if="row.order">
                    <div
                        v-if="row.order.state.statusInfo"
                        :style="{
                            color: row.order.state.statusInfo.color
                         }"
                        class="s-badge"
                    >
                      {{ row.order.state.statusInfo.titleAdmin }}
                    </div>
                  </div>
                </td>
                <td>
                  <div v-if="row.test === false">
                    --
                  </div>
                  <div v-else-if="row.test">
                    <div class="text-bold">{{ row.test.subject.name }}</div>
                    <div>{{ row.test.passingTypeName }}</div>
                  </div>
                </td>
              </tr>
              </tbody>
            </q-markup-table>
          </q-scroll-area>

        </div>

      </q-tab-panel>
    </q-tab-panels>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import CTable from "~module/edu-org/modules/abit-test/component/list-select";
import CPerson from "~module/edu-org/modules/order/component/person";

export default {
  mixins: [MVroute],
  props: {},
  components: {
    CPerson
  },
  data() {
    return {
      tab: 'result_excel',
      resultExcel: '',
      excelTable: {
        headers: [],
        rows: []
      },
      entities: {
        table: {
          com: CTable,
          selectionType: 'multiple'
        },
        recordsetQuery: () => require('~module/edu-org/modules/abit-test/gql/query/recordset.gql'),
        filterQuery: () => require('~module/edu-org/modules/abit-test/gql/query/filters.gql'),
        filterSchema: [],
        filter: {
          mode: 'admin.' + this.viewId,
          passingType: {in: ['internal']},
          csubject: {in: [-100]}
        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 100,
          page: 1
        },
        status: {
          loaded: false,
          loading: false,
        },
      },
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Выбрать',
          color: 'primary',
          callback: this.onSubmit
        }
      ]
    }
  },
  created() {
  },
  methods: {

    async onLoad() {
      try {
        const rows = await this.$store.dispatch('gql/fetch', {
          query: require('../gql/query/excel_load.gql'),
          variables: {
            data: this.excelTable.rows
          },
        })

        let index = 0
        for (const row of rows) {
          this.$set(this.excelTable.rows[index], 'order', row.order || false)
          this.$set(this.excelTable.rows[index], 'test', row.test || false)
          index++
        }

      } catch (e) {
        console.log(e)
      }
    },

    async convertExcel() {

      this.excelTable.headers = []
      this.excelTable.rows = []

      let data = this.entity.excelText
      let rows = data.split("\n");

      const firstRow = rows.shift()
      const firstRowCells = firstRow.trim().split("\t");
      const headers = []

      const deleteCols = []
      for (const cell of firstRowCells) {
        if (['Почта', 'Из ИРНИТУ?'].indexOf(cell) >= 0) {
          deleteCols.push(headers.length-1)
          continue;
        }
        headers.push(cell)
      }

      this.excelTable.headers = headers

      for (const rowStr of rows) {
        if (rowStr.trim()) {
          const row = {
            fields: {}
          }
          let cells = rowStr.trim().split("\t")
          let colIndex = 0
          for (const cell of cells) {
            colIndex++
            if (deleteCols.indexOf(colIndex) > -1)
              continue;

            row.fields[headers[colIndex]] = cell
          }
          this.excelTable.rows.push(row)
        }
      }

    },
    async onSubmit() {
      this.onResolve && this.onResolve(this.$refs.panel.$refs.table.$refs.table.selectedRowsIds)
      this.visible = false
    }
  }
}

</script>

<style lang="scss" scoped>

.s-accent {

}

</style>
