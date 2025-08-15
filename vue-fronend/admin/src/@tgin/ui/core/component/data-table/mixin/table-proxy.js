

export default {
  components: {

  },
  props: {
    handler: {},
    height: {},
    mode: {default: 'table'},

    toolbarEnable: {default: true},
    toolbarMenu: {},

    filterExpanded: {default: false},
    rows: {default: () => ([])},
    nav: {default: () => ({})},
    info: {default: () => ({})},
    filter: {default: () => ({})},
    status: {default: () => ({})},

    selectionType: {},
    rowsMenu: {},
    columnsVisible: {},
    columnsHidden: {},
    clientSideNav: {},
    idField: {default: '_id'},
    nidField: {default: 'id'},

    pivotable: {default: true},
    reportable: {default: true},

    rowOpener: {default: false},
  },
  data() {
    return {
      filtersDefaults: {},

      columns: [

      ],
    }
  },
  computed: {
    bind() {

      const res = {
        toolbarEnable: this.toolbarEnable,
        toolbarMenu: this.toolbarMenuComp,
        height: this.height,
        handler: this.handler,
        columns: this.columns,
        columnsVisible: this.columnsVisible,
        columnsHidden: this.columnsHidden,
        clientSideNav: this.clientSideNav,
        status: this.status,
        info: this.info,
        rows: this.rows,
        nav: this.nav,
        filter: this.filter,
        filterExpanded: this.filterExpanded,

        navLimit: 20,
        rowOpener: this.rowOpener,
        rowPreprocessFn: this.rowPreprocessFn,
        rowsMenu: this.rowsMenuComp,
        selectionType: this.selectionType,
        sortAsc: true,
        actionsField: "actions",
        idField: this.idField,
        nidField: this.nidField,

        pivotable: this.pivotable,
        reportable: this.reportable,
        mode: this.mode,

        ref: 'table'
      }
      return res
    },
    rowsMenuComp() {
      return this.rowsMenu || []
    },
    toolbarMenuComp() {
      return this.toolbarMenu || []
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
    }
  },
  methods: {
    rowPreprocessFn(node) {
      return node
    },
    reload() {
      this.$refs.table.reload()
    }
  }
}
