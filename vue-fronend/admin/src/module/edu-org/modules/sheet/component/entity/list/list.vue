<template>

    <ui-data-table
        v-bind="bind"
        @filterChange="$emit('filterChange', $event)"
        @update:nav="$emit('update:nav', $event)"

    />

</template>

<script>
import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  components: {},
  props: {
    selectionType: {default: 'none'},
    columnsVisible: {
      default: () => [
        'nid',
        'name',
      ]
    }
  },
  data() {
    return {
      filterDefaults: {
      },
      columns: [
        {name: 'nid', label: 'ID', sortable: true, field: 'nid', opener: true},
        {name: 'name', label: 'Имя', sortable: true, field: 'name', opener: true},
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
