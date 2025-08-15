<template>

  <div
      :class="{
        'com': true,
        ['-filters-' + filtersAlign]: true
      }"
  >


    <ui-data-source
        v-if="!datasourceExternal"
        ref="ds"
        :data.sync="dataState"
    />


    <q-splitter
        v-model="splitterFilter"
        :limits="[0, 100]"
        :style="{
            height: tableHeight
        }"
        class="c-layout"
        separator-class="bg-grey-2"
    >

      <template v-slot:[filtersSlot]>

        <div
            class="c-filters q-pl-md q-pr-sm "
        >

          <div
              class="c-header s-font-md text-weight-bold q-py-sm q-px-md flex"
              style="background1: #eee;position: absolute;top:0;left: 0;width: 100%;"
          >

            <div class="q-mr-auto">Фильтры</div>

            <q-btn
                v-if="filterChanged"
                color="primary"
                dense
                label="сброc"
                outline
                size="13px"
                @click="$refs.filters.onFilterReset"
            />

          </div>

          <ui-data-filters
              ref="filters"
              v-model="dataState.filter"
              :changed.sync="filterChanged"
              :filter-schema="dataState.filterSchema"
              :height="height || tableHeight || dataState.table.height"
              :paths-hidden="filtersPathsHidden"
              class=""
          >
            <template v-slot:bottom>
              <slot name="filters-bottom"/>
            </template>
          </ui-data-filters>

        </div>

      </template>
      <template v-slot:[tableSlot]>


        <component
            :is="tableIs"
            ref="table"
            :client-side-nav="dataState.table.clientSideNav"
            :columns-hidden="dataState.table.columnsHidden"
            :columns-visible="dataState.table.columnsVisible"
            :filter-expanded.sync="filterExpanded"
            :handler="getHandler"
            :height="tableHeight || dataState.table.height || height"
            :info="dataState.info"
            :mode="tableMode"
            :nav.sync="dataState.nav"
            :rows="dataState.rows"
            :selection-type="dataState.table.selectionType"
            :status="dataState.status"
            :toolbar-menu="toolbarMenu"
            :filter="data.filter"
            v-bind="dataState.table"
        />

        <slot name="main-bottom"/>

      </template>

    </q-splitter>

  </div>

</template>

<script>

export default {
  components: {},
  mixins: [],

  props: {
    name: {},
    handler: {},
    data: {},
    filtersEnable: {default: true},
    filtersPathsHidden: {default: () => ([])},
    toolbarMenu: {default: () => ([])},
    tableHeight: {default: null},
    filtersAlign: {default: 'left'},
    datasourceExternal: {default: false},
    filterWidth: {default: 20},
    height: {default: null},
    tableMode: {default: 'table'},
  },
  data() {
    return {
      splitterFilter: this.filtersAlign === 'left' ? this.filterWidth : 100 - this.filterWidth,
      dataState: this.data,
      filterChanged: false,
      filterExpanded: this.filtersEnable
    }
  },
  methods: {
    getHandler() {
      return this.datasourceExternal ? this.handler : this.$refs.ds.$apollo.queries.recordset
    },
    reload() {
      this.$refs.table.reload()
    },
    onReloadPanel(name) {
      if (this.name === name) {
        this.reload()
      }
    }
  },

  watch: {
    dataState(v) {
      this.$emit('update:data', v)
    },
    data(v) {
      this.dataState = v
    },
    filterExpanded(v) {
      if (!v) {
        this.splitterFilter = 0
      } else {
        this.splitterFilter = this.filtersAlign === 'left' ? this.filterWidth : 100 - this.filterWidth
      }
    },

  },
  computed: {
    tableIs() {
      const is = this.dataState.tableIs || this.dataState.table.com || this.dataState.table.is || 'ui-data-table'
      return typeof is === 'function' ? is() : is
    },
    filtersSlot() {
      return this.filtersAlign === 'left' ? 'before' : 'after'
    },
    tableSlot() {
      return this.filtersAlign === 'left' ? 'after' : 'before'
    }
  },
  mounted() {
    this.$bus.on('reload-panel', this.onReloadPanel);
  },
  beforeDestroy() {
    this.$bus.off('reload-panel', this.onReloadPanel);
  },
}
</script>

<style lang="scss" scoped>

.c-filters {
  background: #f1f4f6;

  /deep/ {
    .q-checkbox__inner,
    .q-field {
      background-color: #fff;
    }
  }
}

.c-header {
  position: sticky;
  background: #f1f4f6;
  top: 0;
  z-index: 1;
}

.com {
  &.-filters-left {
    .c-filters {
      border-right: 1px solid #ccc;
    }
  }

  &.-filters-right {
    .c-filters {
      border-left: 1px solid #ccc;
    }
  }
}

</style>
