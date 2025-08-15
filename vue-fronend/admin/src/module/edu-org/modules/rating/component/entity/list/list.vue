<template>

  <ui-data-table
      v-bind="bind"
      @filterChange="$emit('filterChange', $event)"
      @update:nav="$emit('update:nav', $event)"
  />

</template>

<script>
import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy"
import * as cell from "../cell"

export default {
  mixins: [MTableProxy],
  components: {},
  props: {
    selectionType: {default: 'none'},
    columnsVisible: {
      default: () => [
        'nid',
        'createAt',
        'generateStartAt',
        'generateEndAt',
        'generateTime',
        'generateProcess',
        'actual'
      ]
    }
  },
  data() {
    return {
      filterDefaults: {},
      columns: [
        {name: 'nid', label: 'ID', sortable: true, field: 'nid', opener: true},
        {
          name: 'createAt',
          label: 'Создан',
          sortable: true,
          field: (row) => this.$util.date.timestampToFormat(row.createAt, 'DD MMM HH:mm'),
          opener: true
        },
        {
          name: 'generateStartAt',
          label: 'Начало генерации',
          sortable: true,
          field: (row) => row.generateStartAt ? this.$util.date.timestampToFormat(row.generateStartAt, 'DD MMM HH:mm') : '',
          opener: true
        },
        {
          name: 'generateEndAt',
          label: 'Окончание генерации',
          sortable: true,
          field: (row) => row.generateEndAt ? this.$util.date.timestampToFormat(row.generateEndAt, 'DD MMM HH:mm') : '',
          opener: true
        },
        {
          name: 'generateTime',
          label: 'Время генерации',
          sortable: true,
          field: (row) => row.generateTime ? row.generateTime + ' сек' : '',
          opener: true
        },
        {name: 'generateProcess', label: 'Процесс', sortable: true, com: cell.process, opener: true},
        {name: 'actual', label: 'Актуальный', sortable: true, field: (row) => row.actual ? 'да' : '', opener: true},
      ],
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>

.c-header {
  /deep/ .q-icon {
    font-size: 18px;
  }
}


</style>
