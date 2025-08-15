<template>

  <ui-data-table
      v-bind="bind"
      @filterChange="$emit('filterChange', $event)"
      @update:nav="$emit('update:nav', $event)"

  />

</template>

<script>
import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";
import * as cells from "../cell";

export default {
  mixins: [MTableProxy],
  components: {},
  props: {
    selectionType: {default: 'multiple'}
  },
  data() {
    return {
      filterDefaults: {
        //  id: {eq: 23620}
      },
      columns: [
        {name: 'id', label: 'ID', sortable: true, field: 'id', opener: true},
        {name: 'name', label: 'Имя', sortable: true, field: 'name', opener: true},
        {name: 'admission.name', label: 'Набор', sortable: true, field: 'admission.name', opener: true},
        {name: 'admission.direct_name', label: 'Направление', sortable: true, field: 'admission.direct_name', opener: true},
        {name: 'admission.fob.name', label: 'Набор', sortable: true, field: 'admission.fob.name', opener: true},
        {name: 'source.name', label: 'Основа', sortable: true, field: 'source.name', opener: true},
        {name: 'admissionNumber', label: 'Мест', sortable: true, field: 'admissionNumber', opener: true},
      ],
    }
  },
  computed: {

  },
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
