<template>
  <div>


  </div>
</template>

<script>

export default {
  components: {},
  props: {
    data: {default: () => ({})},
    recordsetQuery: {},
    query: {},

    mode: {},
    rows: {default: () => ([])},
    nav: {default: () => ({})},
    info: {default: () => ({})},

    variables: {default: () => ({})},
    where: {default: () => ({})},
    filter: {default: () => ({})},
    filterSchema: {default: () => ([])},
    filterQuery: {},

    skip: {default: false},
  },
  apollo: {
    recordset: () => {
      return {
        query() {
          return this.queryState ? this.queryState() : this.recordsetQueryState()
        },
        variables() {
          return {
            mode: this.mode,
            filter: this.filterState,
            where: this.whereState,
            nav: this.navStateQueriable,
            ...this.variablesState
          }
        },
        update(data) {
          return data.res
        },
        error (e) {
          this.$bus.emit('processMessages', this.$util.graphql.exceptionToMessages(e))
        },
        deep: true,
        fetchPolicy: 'no-cache',
        notifyOnNetworkStatusChange: true,
      }
    },
    filterSchemaResult: {
      query() {
        return this.filterQueryState()
      },
      variables() {
        return {}
      },
      update(data) {
        return data.res
      },
      error (e) {
        this.$bus.emit('processMessages', this.$util.graphql.exceptionToMessages(e))
      },
      skip: true,
      notifyOnNetworkStatusChange: true
    }
  },

  data() {

    const dataState = {
      query: this.query,
      recordsetQuery: this.recordsetQuery,
      filterQuery: this.filterQuery,
      info: this.info,
      rows: this.rows,
      nav: this.nav,
      variables: this.variables,
      filter: this.filter,
      filterSchema: this.filterSchema,
      where: this.where,
      ...this.data,
    }

    return {
      fromObject: !!Object.keys(this.data).length,

      dataState: dataState,

      dataStateUpdateInternal: false,

      queryState: dataState.query,
      recordsetQueryState: dataState.recordsetQuery,
      filterQueryState: dataState.filterQuery,
      infoState: dataState.info,
      rowsState: dataState.rows,

      variablesState: dataState.variables,
      filterState: dataState.filter,
      filterSchemaState: dataState.filterSchema,
      whereState: dataState.where,
      navState: dataState.nav,
      navDefault: dataState.nav,

      internalUpdate: false,
      recordsetLoaded: false,
      filterSchemaLoaded: !(this.data.filterQuery || this.filterQuery),
    }
  },
  mounted() {

    if (this.dataState.filterQuery)
      this.$apollo.queries.filterSchemaResult.skip = false
  },
  computed: {

    navStateQueriable() {
      return {
        page: this.navState.page,
        sortField: this.navState.sortField,
        sortAscending: this.navState.sortAscending,
        limit: this.navState.limit,
        cache: this.navState.cache,
      }
    },

    statusComp() {
      return {
        loading: this.$apollo.loading,
        loaded: this.recordsetLoaded && this.filterSchemaLoaded
      }
    }
  },
  watch: {

    data: {
      handler: function (val) {
        if (!this.dataStateUpdateInternal) {
          // console.log(this.dataState.filter)
        }
      },
      deep: true,
    },

    dataState: {
      handler: function (val) {

        this.$nextTick(() => {
          this.$emit('update:data', val)
        })

      },
      deep: true,
    },

    statusComp(val) {

      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$nextTick(() => {

            this.dataStateUpdate({
              status: val,
            })
          })
        })
      })
    },

    'data.filter': {
      handler: function (val) {
        this.dataState.filter = this.filterState = val
      },
      deep: true,
    },

    filter: {
      handler: function (val) {
        this.dataState.filter = this.filterState = val
      },
      deep: true,
    },

    'data.nav': {
      handler: function (val) {
        this.dataState.nav = this.navState = val
      },
      deep: true,
    },

    nav: {
      handler: function (val) {

        if (this.internalUpdate) {
          this.internalUpdate = false
          return
        }

        this.dataStateUpdate({
          nav: this.navPrepare(val),
        })
      },
      deep: true,
    },

    recordset(res) {

      // this.internalUpdate = true

      let resInfo, resNodes

      if (this.queryState) {
        resInfo = {}
        resNodes = res
      } else {
        resInfo = res.info
        resNodes = res.nodes
      }

      if (resInfo.total) {
        this.infoState.total = resInfo.total
      }

      if (resInfo.limit) {
        this.navState.limit = resInfo.limit
      }

      //Object.assign(this.navState, rsNav)

      this.rowsState = resNodes

      this.dataStateUpdate({
        nav: this.navState,
        info: this.infoState,
        rows: this.rowsState,
      })

      this.recordsetLoaded = true
    },

    filterSchemaResult(schema) {
      this.dataStateUpdate({
        filterSchema: schema,
      })
      this.filterSchemaLoaded = true
    },
  },

  methods: {

    dataStateUpdate(data) {

      this.dataStateUpdateInternal = true

      if (this.fromObject) {
        Object.assign(this.dataState, data)

      } else {
        for (const [propName, propValue] of Object.entries(data)) {
          this[propName + 'State'] = propValue
          this.$emit('update:' + propName, propValue)
        }
      }

      this.$nextTick(() => {
        this.$nextTick(() => {
          this.dataStateUpdateInternal = false
        })
      })
    },

    navPrepare(nav) {
      return {
        limit: this.navDefault.limit,
        ...nav,
      }
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
