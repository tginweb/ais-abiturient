<template>

  <div>

    <ui-data-table
        :toolbar-enable="toolbarEnable"
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
        :rows-menu="rowsMenuComp"
        :selection-type="selectionType"
        :sort-asc="true"
        :toolbar-menu="toolbarMenuComp"
        actions-field="ACTIONS"
        id-field="ID"
        @filterChange="$emit('filterChange', $event)"
        class=""
    >
      <template v-slot:right v-if="$slots.right">
        <slot name="right"/>
      </template>
    </ui-data-table>

  </div>

</template>

<script>


export default {
  components: {},
  props: {
    handler: {},
    height: {},

    toolbarEnable: {default: true},
    rows: {default: () => ([])},
    nav: {default: () => ({})},
    info: {default: () => ({})},
    filter: {default: () => ({})},
    status: {default: () => ({})},

    selectionType: {},
    rowsMenu: {},
    toolbarMenu: {},
    columnsVisible: {},
    columnsHidden: {default: () => []},
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
          name: 'USER_ID',
          label: 'Пользователь',
          sortable: true,
          field: (row, get) => row.USER ? row.USER.NAME_FULL + ' [' + row.USER.ID + ']' : ''
        },
        {
          name: 'NAME',
          label: 'Наименование',
          sortable: true,
          field: 'NAME'
        },
        {
          name: 'PERSON_TYPE_ID',
          label: 'Тип профиля',
          sortable: true,
          field: 'PERSON_TYPE.NAME'
        },
        {
          name: 'DEFAULT',
          label: 'По умолчанию',
          sortable: true,
          field: (row) => this.getUserProfileId(row.USER) === row.ID,
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

    getUserProfileId(user) {
      if (!user)
        return;

      const prop = user.PROPS.find(prop => prop.CODE === 'ORDER_PROFILE_ID')
      if (prop) {
        return parseInt(prop.VAL)
      }
    }

  }
}
</script>

<style lang="scss" scoped>


</style>
