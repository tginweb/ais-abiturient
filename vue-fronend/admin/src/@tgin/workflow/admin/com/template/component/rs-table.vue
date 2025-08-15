<template>

  <div>

    <ui-data-qtable
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
          label: 'ID',
          sortable: true,
          field: 'ID'
        },
        {
          name: 'CREATED',
          label: 'Дата создания',
          sortable: true,
          field: 'CREATED'
        },
        {
          name: 'BUYER_NAME',
          label: 'Плательщик',
          sortable: true,
          field: 'BUYER_NAME'
        },
        {
          name: 'STUDENT_NAME',
          label: 'Обучающийся',
          sortable: true,
          field: 'STUDENT_NAME'
        },
        {
          name: 'PRICE',
          label: 'Стоимость',
          sortable: true,
          field: 'PRICE'
        },
        {
          name: 'PAID_SUM',
          label: 'Оплачено',
          sortable: true,
          field: 'PAID_SUM',
        },

        {
          name: 'DEBT',
          label: 'Долг',
          sortable: true,
          field: 'DEBT'
        },
        {
          name: 'STATUS',
          label: 'Статус',
          sortable: true,
          field: 'STATUS_NAME'
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
