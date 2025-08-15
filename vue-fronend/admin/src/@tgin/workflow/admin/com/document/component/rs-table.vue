<template>

  <div>

    <ui-data-table
        :toolbar-enable="toolbarEnable"
        :toolbar-menu="toolbarMenuComp"
        :height="height"
        :handler="handler"
        :columns="columns"
        :columns-visible="columnsVisible"
        :columns-hidden="columnsHidden"

        :status="status"
        :info="info"
        :rows="rows"
        :nav="nav"
        :filter="filter"

        @update:nav="$emit('update:nav', $event)"

        :nav-limit="20"
        :row-opener="true"
        :row-preprocess-fn="rowPreprocessFn"
        :rows-menu="rowsMenuComp"
        :selection-type="selectionType"
        :sort-asc="true"
        actions-field="ACTIONS"
        id-field="ID"
        @filterChange="$emit('filterChange', $event)"

        class=""
    />

  </div>


</template>

<script>

import * as cells from './cell'

export default {
  components: {

  },
  props: {
    handler: {},
    height: {},

    toolbarEnable: {default: true},
    toolbarMenu: {},

    rows: {default: () => ([])},
    nav: {default: () => ({})},
    info: {default: () => ({})},
    filter: {default: () => ({})},
    status: {default: () => ({})},

    selectionType: {},
    rowsMenu: {},
    columnsVisible: {},
    columnsHidden: {},

  },
  data() {
    return {
      filtersDefaults: {},

      columns: [
        {
          name: 'ID',
          label: 'ID документа',
          sortable: true,
          field: 'ID'
        },
        {
          name: 'ENTITY_TYPE_INFO.name',
          label: 'Тип объекта',
          sortable: true,
          field: 'ENTITY_TYPE_INFO.name',
        },
        {
          name: 'ENTITY_ID',
          label: 'Объект',
          sortable: true,
          field: 'ENTITY.NAME',
          link: (row) => this.$entity.getUrl('school.contract', row.ENTITY, null, 'admin')
        },
        {
          name: 'TEMPLATE_ID',
          label: 'Тип документа',
          sortable: true,
          field: 'TEMPLATE_ELEMENT.NAME',
        },

        {
          name: 'DOWNLOAD',
          label: 'Cкачать',
          sortable: true,
          opener: false,
          com: cells.download,
        },
        {
          name: 'CREATED',
          label: 'Дата создания',
          sortable: true,
          field: 'CREATED'
        },
        {
          name: 'ACTIVE',
          label: 'Активность',
          sortable: true,
          field: 'ACTIVE',
          type: 'boolean'
        },
      ],
    }
  },
  computed: {
    rowsMenuComp() {
      return this.rowsMenu || []
    },
    toolbarMenuComp() {
      return this.toolbarMenu || []
    },
  },
  methods: {
    rowPreprocessFn(node) {
      return node
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
