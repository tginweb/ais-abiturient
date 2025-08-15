<template>

  <div class="flex column no-wrap" style="height: 100%;">


    <q-toolbar
        v-if="toolbarVisible"
        :class="headerClass"
        class="c-header text-secondary q-mb-xs q-py-xs s-font-sm  bg-grey-2 items-center"
        dark
        style=""
    >

      <div class="flex no-wrap items-center q-gutter-x-md">

        <q-toggle
            v-model="filterExpandedState"
            :label="filterExpandedState ? 'скрыть фильтры' : 'показать фильтры'"
        />

        <q-btn
            dense
            flat
            icon="refresh"
            label="обновить"
            size="14px"
            @click="reload"
        />

        <q-btn
            v-if="true"
            :label="'колонки ' + ((layoutColumnsVisible.length === layoutColumnsAvailable.length) ? 'все' : layoutColumnsVisible.length + ' из ' + layoutColumnsAvailable.length)"
            dense
            flat
            icon="view_column"
            size="14px"
        >
          <q-menu auto-close>

            <div class="flex q-px-md q-py-sm bg-white" style="position: sticky; top: 0;z-index:1">
              <q-btn color="primary" label="Сохранить" outline size="14px" @click.stop="onLayoutSave"/>
              <q-btn class="q-ml-auto" label="Сбросить" outline size="14px" @click.stop="onLayoutReset"/>
            </div>

            <q-list>
              <q-item
                  v-for="(column, index) of layoutColumnsAvailable"
                  :key="index"
                  clickable
              >
                <q-item-section>
                  <q-checkbox v-model="layouts[modeState].columns" :label="column.label" :val="column.name"/>
                </q-item-section>
              </q-item>
            </q-list>

          </q-menu>
        </q-btn>

        <q-select
            v-if="modes.length > 1"
            v-model="modeState"
            :options="modes"
            class="q-py-none"
            dense
            emit-value
            map-options
            outlined
            size="12px"
        />

        <q-btn dense label="Экспорт" outline size="14px">
          <q-menu>
            <q-list>
              <q-item v-close-popup clickable @click="exportExcel">
                <q-item-section>Excel</q-item-section>
              </q-item>
              <q-item v-close-popup clickable @click="exportCsv">
                <q-item-section>CSV</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

      </div>

      <div class="q-ml-auto flex q-gutter-md">

        <ui-menu-toolbar
            v-if="toolbarMenu.length"
            :callback="onRowAction"
            :items="toolbarMenu"
            :root-dense="true"
            :root-flat="true"
            class="q-gutter-sm"
        />


      </div>

    </q-toolbar>

    <div ref="body" class="relative-position col-grow">

      <q-resize-observer @resize="onResize"/>

      <q-table
          v-if="modeState === 'table'"
          ref="table"
          :columns="columnsComp"
          :data="rowsPrepared"
          :expanded.sync="rowsExpandedIds"
          :grid="gridActive"
          :hide-bottom="!!rowsPrepared.length && hideBottom"
          :hide-pagination="!paginationEnable"
          :loading="status.loading"
          :no-results-label="noResultsLabel"
          :pagination.sync="pagination"
          :row-key="idField"
          :rows-per-page-options="[10, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 15000, 20000]"
          :selected.sync="selectedRows"
          :selection="selectionType"
          :table-style="{
            maxHeight: (bodyHeight-60) + 'px',
            minHeight: (bodyHeight-60) + 'px',
          }"
          :title="title"
          :virtual-scroll-1="pagination.rowsPerPage && pagination.rowsPerPage > 500 ? true : false"
          :virtual-scroll-slice-size="100"
          card-container-class="q-col-gutter-lg"
          class="c-table"
          separator="cell"
          table-class="s-table-data"
          v-bind="bind"
          @request="onOrdersRequest"
      >
        <template v-slot:bottom-row="props" v-if="false">
          <q-tr>

            <q-td
                v-if="actionsColumnEnableComp"
                class="c-controls"
                style="width: 40px;"
            >
            </q-td>
            <q-td v-if="treeMode">
            </q-td>
            <q-td
                v-if="selectionType && selectionType !== 'none'"
                :class="selectionThClass"
                style="text-align: center;"
            >

            </q-td>

            <q-td
                v-for="col in props.cols"
                :key="col.name"
                :class="{}"
            >
              {{ col.labelShort || col.label }}
            </q-td>


          </q-tr>
        </template>

        <template v-slot:item="props">

          <c-table-body-row-card
              :props="props"
              v-bind="rowPropsSubset"
              @row-open="onRowOpen"
          />

        </template>

        <template v-slot:header="props">
          <q-tr :props="props">

            <q-th
                v-if="actionsColumnEnableComp"
                class="c-controls"
                style="width: 40px;"
            >
            </q-th>
            <q-th v-if="treeMode">
            </q-th>
            <q-th
                v-if="selectionType && selectionType !== 'none'"
                :class="selectionThClass"
                style="text-align: center;"
            >

              <div v-if="selectionLabel" class="text-center">
                {{ selectionLabel }}
              </div>

              <slot v-if="$slots['selection-th-inner']" name="selection-th-inner"/>

              <q-checkbox
                  v-else-if="selectionType==='multiple'"
                  v-model="props.selected"
                  dense
              />

            </q-th>

            <q-th
                v-for="col in props.cols"
                :key="col.name"
                :class="{
                  'col-sticky': col.sticky,
                  [col.head && col.head.class]: true
                }"
                :props="props"
                :style="col.head && col.head.style"
            >
              {{ col.labelShort || col.label }}
            </q-th>

          </q-tr>
        </template>

        <template v-slot:body="props">

          <component
              :is="rowsPreparedById[props.row[idField]].is"
              v-if="!props.row.parentId || rowsExpandedIdsIndexed[props.row.parentId]"
              :props="props"
              v-bind="rowPropsSubset"
          >
            <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
              <slot :name="name" v-bind="slotData"/>
            </template>
          </component>

        </template>
      </q-table>
      <q-table
          v-if="modeState === 'report'"
          ref="table"
          :columns="columnsComp"
          :data="rowsPrepared"
          :expanded.sync="rowsExpandedIds"
          :grid="gridActive"
          :hide-bottom="!!rowsPrepared.length && hideBottom"
          :hide-pagination="!paginationEnable"
          :loading="status.loading"
          :no-results-label="noResultsLabel"
          :pagination.sync="pagination"
          :row-key="idField"
          :rows-per-page-options="[10, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 15000, 20000]"
          :selected.sync="selectedRows"
          :selection="selectionType"
          :table-style="{
            maxHeight: (bodyHeight-60) + 'px',
            minHeight: (bodyHeight-60) + 'px',
          }"
          :title="title"
          :virtual-scroll-slice-size="100"
          :virtual-scroll1="pagination.rowsPerPage && pagination.rowsPerPage > 500 ? true : false"
          card-container-class="q-col-gutter-lg"
          class="c-table"
          separator="cell"
          table-class="s-table-data"
          v-bind="bind"
          @request="onOrdersRequest"
      >
        <template v-slot:header="props">
          <q-tr :props="props">

            <q-th
                v-if="actionsColumnEnableComp"
                class="c-controls"
                style="width: 40px;"
            >


            </q-th>
            <q-th v-if="treeMode">
            </q-th>

            <q-th
                v-if="selectionType && selectionType !== 'none'"
                :class="selectionThClass"
                style="text-align: center;"
            >

              <div v-if="selectionLabel" class="text-center">
                {{ selectionLabel }}
              </div>

              <slot v-if="$slots['selection-th-inner']" name="selection-th-inner"/>

              <q-checkbox
                  v-else-if="selectionType==='multiple'"
                  v-model="props.selected"
                  dense
              />

            </q-th>


            <q-th
                v-for="col in props.cols"
                :key="col.name"
                :class="{
                  'col-sticky': col.sticky,
                  [col.head && col.head.class]: true
                }"
                :props="props"
                :style="col.head && col.head.style"
            >
              {{ col.labelShort || col.label }}
            </q-th>

          </q-tr>
        </template>
        <template v-slot:body="props">

          <c-report-body-row
              v-if="!props.row.parentId || rowsExpandedIdsIndexed[props.row.parentId]"
              :props="props"
              v-bind="rowPropsSubset"
          >
            <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
              <slot :name="name" v-bind="slotData"/>
            </template>
          </c-report-body-row>

        </template>
      </q-table>

      <div v-else-if="modeState === 'pivot'">

        <ui-pivot
            :cols="[]"
            :items="rowsReport"
            :rows="[]"
            :style="{
                maxHeight: maxHeightState
              }"
        />

      </div>

      <div style="position: absolute; bottom: 10px; left: 10px;" v-if="groupActions">

        <div v-if="false">
          <q-btn label="Сохранить"/>
        </div>

        <div v-if="rowsActions && rowsActions.length && selectedRows.length" class="flex q-gutter-x-md">

          <div>
            <q-checkbox
                v-model="selectAllServer"
                label="ВСЕ"
            />
          </div>

          <ui-menu-toolbar
              :callback="onRowsAction"
              :items="rowsActions"
              :root-dense="true"
              class="q-gutter-x-sm"
              ot-size="15px" ro
          />

        </div>


      </div>

      <q-inner-loading :showing="status.loading">
        <q-spinner-gears color="primary" size="50px"/>
      </q-inner-loading>

    </div>

  </div>

</template>

<script>

import {QBadge, QCheckbox, QInput, QRadio} from 'quasar'

import CTableBodyRow from './inc/body-row'
import CTableBodyRowCard from './inc/body-row-card'
import CTableBodyRowGroup from './inc/body-row-group'

import CReportBodyRow from './inc/report-body-row'

const queryString = require('query-string');

export default {
  components: {
    QBadge,
    QCheckbox,
    QInput,
    QRadio,
    CTableBodyRow,
    CTableBodyRowCard,
    CTableBodyRowGroup,
    CReportBodyRow
  },
  mixins: [],

  props: {
    groupActions: {default: true},

    clientSideNav: {default: false},
    filterExpanded: {default: false},
    filter: {default: () => ({})},
    mode: {default: 'table'},

    tableId: {},
    pivotable: {default: true},
    reportable: {default: true},

    noResultsLabel: {},
    bindRowFn: {},
    rowPointer: {default: false},
    handler: {},
    grid: {default: null},
    gridLt: {default: 'lg'},

    title: {},
    treeMode: {},

    parentField: {default: 'parentId'},

    groups: {default: () => []},

    groupIdField: {default: 'id'},

    hideBottom: {default: false},
    actionsColumnEnable: {default: true},
    paginationEnable: {default: true},
    toolbarEnable: {default: true},
    height: {default: 'auto'},
    maxHeight: {},
    minHeight: {},

    headerClass: {default: ''},

    status: {default: () => ({})},
    rows: {default: () => ([])},
    info: {default: () => ({})},
    nav: {default: () => ({})},

    rowExpandedCom: {},
    rowOpener: {default: false},
    rowMenu: {},
    rowsMenu: {default: () => []},
    rowsPreprocessFn: {},
    rowPreprocessFn: {},

    subrowsMenu: {default: () => []},

    toolbarMenu: {default: () => []},

    columns: {default: () => []},
    columnsVisible: {default: () => []},
    columnsHidden: {default: () => []},

    selectionType: {},
    selectionLabel: {default: ''},
    selectionThClass: {default: null},

    rowsSelectedNids: {default: () => []},
    rowsSelectedIds: {default: () => []},
    storePrefix: {},

    actionsField: {default: 'actions'},

    path: {},

    activeField: {default: 'ACTIVE'},
    idField: {default: '_id'},
    nidField: {default: 'nid'},

    focusedRow: {},
    focusEnable: {default: true},
    clickSelectEnable: {default: false},

  },
  data() {
    const nav = this.prepareNav(this.nav)
    return {
      selectAllServer: false,
      filterExpandedState: this.filterExpanded,
      bodyHeight: 100,
      modeState: this.mode,

      maxHeightState: this.maxHeight || this.height,
      minHeightState: this.minHeight || this.height,

      sortDefault: {
        field: nav.sortField,
        ascending: nav.sortAscending,
      },

      navUpdatedExternal: false,
      navState: nav,
      rowsState: this.rows,

      pagination: this.tableNavToPagination(nav, this.info),

      layouts: {
        table: this.getSavedLayout('table'),
        report: this.getSavedLayout('report'),
        pivot: this.getSavedLayout('pivot'),
      },

      radioSelectedRow: null,
      selectedRows: [],
      selectedSubrows: [],

      focusedRowState: this.focusedRow,

      rowsActions: [],
      rowsExpandedIds: [],
      rowsInited: false,
      rowsEdited: {}
    }
  },
  mounted() {


  },
  created() {

  },
  computed: {

    actionsColumnEnableComp() {
      return this.actionsColumnEnable && (this.modeState !== 'report')
    },

    layout() {
      return this.layouts[this.modeState]
    },

    layoutColumnsVisible() {
      return this.columns.filter(col => this.layout.columns.indexOf(col.name) > -1)
    },

    layoutColumnsAvailable() {
      const columns = this.getColumns(this.modeState)
      return this.columns.filter(col => columns.indexOf(col.name) > -1)
    },

    toolbarVisible() {
      return true || this.toolbarMenu.length || this.modes.length > 1
    },

    rowsExpandedIdsIndexed() {
      return this.rowsExpandedIds.reduce((map, id) => {
        map[id] = id
        return map
      }, {})
    },

    modes() {

      const res = [
        {
          value: 'table',
          label: 'таблица'
        }
      ]

      if (this.pivotable) {
        res.push({
          value: 'pivot',
          label: 'сводная таблица'
        })
      }

      if (this.reportable) {
        res.push({
          value: 'report',
          label: 'отчет'
        })
      }

      return res
    },

    rowsReport() {
      return this.rows.map(row => {
        const res = {}
        for (const col of this.columns) {
          const field = col.reportField || col.field
          if (field) {
            res[col.reportLabel || col.label] = typeof field === 'function' ? field(row, this.$util.base.deepGet) : this.$util.base.deepGet(row, field)
          }
        }
        return res
      })
    },

    rowPropsSubset() {
      return {
        modeState: this.modeState,
        selectionLabel: this.selectionLabel,
        selectionType: this.selectionType,
        rowExpandedCom: this.rowExpandedCom,
        gridActive: this.gridActive,
        rowOpener: this.rowOpener,
        onRowOpen: this.onRowOpen,
        rowMenuComp: this.rowMenuComp,
        onRowClick: this.onRowClick,
        onRowDblClick: this.onRowDblClick,
        onRowEdit: this.onRowEdit,
        actionsColumnEnable: this.actionsColumnEnableComp,
        onRowAction: this.onRowAction,
        focusedRowState: this.focusedRowState,
        idField: this.idField,
        activeField: this.activeField,
        radioSelectedRow: this.radioSelectedRow,
        bindRowFn: this.bindRowFn,
        treeMode: this.treeMode,
      }
    },


    gridActive() {
      return this.grid !== false ? this.grid || this.gridLt && (this.$q.screen.lt[this.gridLt]) : false
    },

    bind() {
      const res = {}

      if (this.paginationEnable) {
        res.pagination = this.pagination
      }

      return res
    },

    loaded() {
      return this.status.loaded
    },

    rowsIds() {
      return this.rowsState.map(row => row[this.idField])
    },

    rowsMenuComp() {
      //return [...this.rowsMenu.map(item => this.rowsMenuItemPrepare(item)), ...this.rowsActions]
      return [...this.rowsActions]
    },

    subrowsMenuComp() {
      return this.subrowsMenu.map(item => this.rowsMenuItemPrepare(item))
    },

    groupsById() {
      return this.groups.reduce((map, group) => {
        map[group[this.groupIdField]] = group
        return map
      }, {})
    },

    rowsPreparedById() {
      return this.rowsPrepared.reduce((map, row) => {
        map[row[this.idField]] = row
        return map
      }, {})
    },

    groupColumn() {
      return this.columns.find(col => !!col.group)
    },

    rowsPrepared() {

      let prevGroup


      return (this.rowsState || []).reduce((result, row) => {

        const crow = {
          ...row,
          _actions: [],
          is: 'c-table-body-row'
        }


        if ((!this.clientSideNav || !this.pagination.sortBy) && this.groupColumn) {

          const group = typeof this.groupColumn.field === 'function' ? this.groupColumn.field(row, this.$util.base.deepGet) : this.$util.base.deepGet(row, this.groupColumn.field)

          if (group && (group !== prevGroup)) {
            result.push({
              is: 'c-table-body-row-group',
              _role: 'group',
              value: group,
              row: row,
              com: this.groupColumn.com
            })
          }
          prevGroup = group
        }

        if (crow[this.actionsField])
          crow._actions = crow[this.actionsField]

        if (crow.children) {
          crow.children = crow.children.map(subrow => {

            const csubrow = {
              ...subrow,
              is: 'c-table-body-row'
            }

            if (csubrow[this.actionsField])
              csubrow._actions = csubrow[this.actionsField]

            return csubrow
          })
        }

        result.push(this.rowPreprocessFn ? this.rowPreprocessFn(crow) : crow)
        return result
      }, [])
    },

    columnsCompByName() {
      return this.columnsComp.reduce((map, item) => {
        map[item.name] = item
        return map
      })
    },

    columnsComp() {
      return this.layoutColumnsVisible.map(item => {

        const col = {
          ...item
        }

        col.style = col.style || {}

        if (col.nowrap) {
          col.style.whiteSpace = 'nowrap !important';
        }

        if (col.align) {
          col.style.textAlign = col.align + ' !important';
        }

        if (col.grid) {

          col.gridStyle = col.grid.style || {}
          col.gridClass = col.grid.class || {}

          if (col.grid.align)
            col.gridStyle.textAlign = col.grid.align + ' !important';

        }

        if (col.field) {

          let field = col.field

          if (typeof col.field === 'function') {

            col.field = (row) => {
              return field(row, this.$util.base.deepGet)
            }

          } else {

            col.field = (row) => {
              return this.$util.base.deepGet(row, field)
            }

          }
        }

        if (!col.format) {
          switch (col.type) {
            case 'progress':
              col.com = require('./inc/format-progess').default;
              break;
            default:
              if (this.$util.format[col.type]) {
                col.format = this.$util.format[col.type]
              }
              break;
          }
        }

        return col
      })
    },

    selectedRowsIds() {
      return this.selectedRows.map(row => row[this.idField])
    },

    selectedRowsNids() {
      return this.selectedRows.map(row => row[this.nidField])
    },

    selectedRowId() {
      return this.selectedRow ? this.selectedRow[this.idField] : null
    },

    selectedRow() {
      return this.selectedRows.length ? this.selectedRows[0] : null;
    },

    itemsById() {
      return this.data.rowsPrepared.reduce((map, o) => (map[o._id] = o, map), {});
    }
  },
  watch: {

    filterExpandedState(v) {
      this.$emit('update:filterExpanded', v)
    },

    filterExpanded(v) {
      this.filterExpandedState = v
    },

    mode(v) {
      this.modeState = v
    },

    height(v) {
      this.maxHeightState = this.maxHeight || this.height
      this.minHeightState = this.minHeight || this.height
    },

    rows(val) {
      this.rowsState = val
    },

    nav: {
      handler: function (val) {

        this.pagination = this.tableNavToPagination(this.nav, this.info)

        this.navUpdatedExternal = true

        this.navState = this.prepareNav(this.nav)
      },
      deep: true
    },

    info: {
      handler: function (val) {

        this.pagination = this.tableNavToPagination(this.nav, this.info)

        this.navUpdatedExternal = true

        this.navState = this.prepareNav(this.nav)
      },
      deep: true
    },

    navState: {
      handler: function (val) {
        if (this.navUpdatedExternal) {
          this.navUpdatedExternal = false
          return
        }

        if (!this.loaded)
          return

        this.$nextTick(() => {
          this.$emit('update:nav', val)
        })
      },
      deep: true
    },


    radioSelectedRow(val) {
      this.selectedRows = val ? [val] : []
    },

    selectedRows() {
      this.$emit('selectedRows', this.selectedRows)
      this.$emit('update:selected', this.selectedRows)
    },

    focusedRowState(val) {
      this.$emit('update:focusedRow', val)

      if (val)
        this.$emit('focusedRow', this.focusedRowState, this.focusedRowState[this.idField])
      else
        this.$emit('focusedRow', null)
    },

    rowsIds() {

      this.rowsActions = Object.values(this.rowsState.reduce((map, row) => {
        if (row[this.actionsField]) {
          for (const action of row[this.actionsField]) {
            if (action.group && !map[action.id]) {
              map[action.id] = action
            }
          }
        }
        return map
      }, {}))


    },

    rowsPrepared: {
      deep: true,
      immediate: true,
      handler: function (rows) {

        if (rows.length && !this.rowsInited) {

          if (this.selectionType && this.selectionType !== 'none') {

            this.selectedRows = this.rows.filter(row => {
              return this.rowsSelectedIds.indexOf(row[this.idField]) > -1
            })

            if (this.selectedRows.length) {
              this.radioSelectedRow = this.selectedRows[0]
            } else {
              this.radioSelectedRow = null
            }

            this.rowsInited = true
          }
        }

        this.selectedSubrows = rows.reduce((map, row) => {
          if (row.selectedSubrows && row.selectedSubrows.length) {
            map = [...map, ...row.selectedSubrows]
          }
          return map
        }, [])
      },

    },

    selectedRowsIds(val) {
      this.$emit('update:rowsSelectedIds', val)
    },

  },
  methods: {
    exportCsv() {
      const table = this.$refs.table.$el.getElementsByTagName("table")[0]

      // Variable to store the final csv data
      var csv_data = [];

      // Get each row data
      var rows = table.querySelectorAll('tr');

      for (var i = 0; i < rows.length; i++) {

        var cols = rows[i].querySelectorAll('td,th');

        var csvrow = [];
        for (var j = 1; j < cols.length; j++) {

          let cellContent = cols[j].innerHTML.replace(/(<i[^>]*>.*?<\/i>|\n|\r)/gi, "");
          cellContent = this.$util.html.stripTags(cellContent)
          cellContent = cellContent.replace(/^[\s\t]+/, "")
          cellContent = cellContent.replace(/[\s\t]+$/, "")

          csvrow.push(cellContent);
        }

        csv_data.push(csvrow.join(";"));
      }

      csv_data = csv_data.join('\n');

      let a = document.createElement('a');
      a.href = `data:text/csv, ${encodeURIComponent(csv_data)}`
      a.download = 'downloaded_file.csv'
      a.click()
    },

    exportExcel() {

      const table = this.$refs.table.$el.getElementsByTagName("table")[0]

      let tableData = table.outerHTML;

      tableData = tableData.replace(/<i[^>]*>.*?<\/i>/gi, "");

      tableData = this.$util.html.stripTags(tableData, '<table><thead><tbody><tr><td><th>')

      let a = document.createElement('a');
      a.href = `data:application/vnd.ms-excel, ${encodeURIComponent(tableData)}`
      a.download = 'downloaded_file.xls'
      a.click()
    },

    getSavedLayout(mode) {
      const savedData = this.$q.localStorage.getItem(this.getTableId(mode))
      if (savedData) {
        return savedData
      } else {
        return {
          columns: this.getColumns(mode, true)
        }
      }
    },

    onResize() {
      if (this.$refs.body) {
        this.bodyHeight = this.$refs.body.clientHeight
      }
    },

    getTableId(mode) {
      return (this.tableId || this.$route.name) + '.' + mode
    },

    onLayoutSave() {
      this.$q.localStorage.set(this.getTableId(this.modeState), this.layouts[this.modeState])
    },

    onLayoutReset() {
      this.layouts[this.modeState] = {
        columns: this.getColumns(this.modeState, true)
      }
      this.$q.localStorage.remove(this.getTableId(this.modeState))
    },

    navCallback(data) {

      this.$routerNav(data)
    },

    getColumns(mode, filter = false) {

      let columns = this.columns

      columns = columns.filter(col => {
        if (col[mode] === false) {
          return false
        } else if (col[mode] === true) {
          return true
        } else {
          if (mode === 'table') {
            return true
          } else {
            return !!col.field
          }
        }
      })

      if (filter) {
        const columnsVisible = this[mode + 'ColumnsVisible'] || (mode === 'table' && this.columnsVisible)
        const columnsHidden = this[mode + 'ColumnsHidden'] || (mode === 'table' && this.columnsHidden)

        if (columnsVisible && columnsVisible.length)
          columns = columns.filter(col => columnsVisible.indexOf(col.name) > -1)

        if (columnsHidden && columnsHidden.length)
          columns = columns.filter(col => columnsHidden.indexOf(col.name) === -1)
      }

      return columns.map(col => col.name)
    },

    prepareNav(nav) {
      return {
        sortField: this.nidField,
        sortAscending: false,
        page: 1,
        ...nav
      }
    },

    async onSubrowsAction(data) {
      try {


        const action = {
          ...data
        }

        const args = {
          targets: this.selectedSubrows,
        }

        action.params = Object.assign(action.params || {}, args)

        action.onResolve = (res) => {

          if (res && res.result) {
            this.$bus.emit('processMessages', res.result.messages);
          }

          this.reload(true)
        }

        await this.$store.dispatch('router/nav', action)
      } catch (e) {
        console.log(e)
      }
    },

    async onRowsAction(data) {

      try {

        const action = {
          ...(data.command || data)
        }

        const args = {
          ids: this.selectedRowsIds,
        }

        if (this.selectAllServer) {
          args.selectAll = true
          args.selectFilter = this.filter
        }

        action.args = {
          ...(action.args || {}),
          ...args
        }

        action.onResolve = (res) => {
          this.reload(true)
        }

        console.log(action)

        this.$store.dispatch('command/runMenuItem', action)

      } catch (e) {
        console.log(e)
      }
    },

    async onRowAction(action) {


      const actionExt = {
        ...action,
      }

      actionExt.onResolve = (res) => {
        this.reload()
      }

      if (this.focusedRowState) {

        const id = this.focusedRowState[this.idField]

        actionExt.args = {
          ...(actionExt.args || {}),
          id: id
        }

        if (actionExt.argsIdMultiple) {
          actionExt.args.ids = [id]
        }
      }

      try {
        await this.$store.dispatch('command/runMenuItem', actionExt)
      } catch (e) {
        console.log(e)
      }
    },

    onRowOpen(row) {

      this.$nextTick(() => {

        setTimeout(() => {

          if (row._actions) {
            const action = row._actions.find(item => item.listEvent === 'open')

            if (action) {
              this.onRowAction(action)
            }

            this.$emit('rowOpen', row, row[this.idField])
          }

        }, 50)

      })
    },

    onRowClick(props) {

      this.$emit('row-click', props)

      if (this.focusEnable) {
        this.focusedRowState = props.row
      }

      if (this.clickSelectEnable) {

        if (this.selectedRows) {
          const rowSelected = this.selectedRows.find(row => row === props.row)

          if (rowSelected) {
            this.selectedRows = this.selectedRows.filter(row => row !== props.row)
          } else {
            this.selectedRows.push(props.row)
          }

        }

      }

    },

    tableNavToPagination(nav, info) {
      if (this.clientSideNav) {
        return {
          rowsPerPage: 5000
        }
      }
      return {
        sortBy: nav.sortField || this.nidField,
        descending: !nav.sortAscending,
        page: nav.page || 1,
        rowsPerPage: nav.limit,
        rowsNumber: info.total
      }
    },

    tablePaginationToNav(pagination) {
      return {
        sortField: pagination.sortBy || this.nidField,
        sortAscending: !pagination.descending,
        page: pagination.page,
        limit: pagination.rowsPerPage,
      }
    },

    rowsMenuItemPrepare(item) {

      let data = {
        ...item
      }

      if (item.children) {
        data.children = item.children.map((subitem) => this.rowsMenuItemPrepare(subitem))
      }

      return data
    },

    onRowDblClick(props) {

    },

    onRowEdit(props) {
      const id = props.row[this.idField]

      if (!this.selectedRows.find(row => row[this.idField] === id)) {
        this.selectedRows.push(props.row)
      }

      this.$set(this.rowsEdited, id, true)
    },

    async onOrdersRequest(props) {

      let pagination = props ? props.pagination : this.pagination;


      if (this.clientSideNav) {
        Object.assign(this.pagination, pagination)
        return;
      }

      let nav = this.tablePaginationToNav(pagination)

      if (!nav.sortField) {
        nav.sortField = this.sortDefault.field
        nav.sortAscending = this.sortDefault.ascending
      }

      Object.assign(this.navState, nav)

      Object.assign(this.pagination, pagination)
    },

    reload(clearSelection = false) {

      if (clearSelection) {
        this.$refs.table.clearSelection()
        this.selectAllServer = false
        this.rowsState.forEach(row => {
          this.$set(row, 'selectedSubrows', [])
        })
      }

      this.handler().refetch()

      if (this.query) {

      }
    },
  }
}
</script>

<style lang="scss" scoped>

/deep/ {
  tr td {
    border-bottom: 2px solid #ddd !important;
    padding: 12px;
  }

  tr:nth-child(even) {
    background-color1: rgb(251, 251, 251);
  }
}

th.col-sticky {
  position: sticky;
  left: 0;
  z-index: 20 !important;
}

/deep/ {
  td.col-sticky {
    position: sticky;
    background-color: rgb(241, 244, 246);
    left: 0;
    z-index: 1;
  }
}


.c-header {
  /deep/ .q-icon {
    font-size: 18px;
  }
}

.c-row-actions-btn {
  line-height: 1rem;

  /deep/ .q-btn__wrapper {
    min-height: 1em;
  }
}

th.c-controls {
  padding: 0 2px 0 2px;
  text-align: center;
}

/deep/ {
  .q-table__bottom {

    .q-table__control:first-child {
      text-align: right;
      margin-right: 20px;

      div {
        width: 100%;
      }
    }

    .q-table__separator {
      display: none;;
    }

  }
}


</style>
