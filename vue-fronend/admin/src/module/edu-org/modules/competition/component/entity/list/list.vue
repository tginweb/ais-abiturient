<template>

  <ui-data-table
      selection-type="multiple"
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
        'id',
        'name',
        'source.name',
        'admissionNumber',
        'admissionNumberTotal',
        'usedNumber',
        'appsCount',
        'ratio',
        'admission.direct_name',
        'admission.fob.name',
        'id',
        'isdop'
      ]
    }
  },
  data() {
    return {
      filterDefaults: {
        //  id: {eq: 23620}
      },
      columns: [
        {name: 'admission.name', label: 'Набор', sortable: true, field: 'admission.name', group: true},

        {name: 'name', label: 'Имя', sortable: true, field: 'name', opener: true},
        {name: 'source.name', label: 'Основа', sortable: true, field: 'source.name', opener: true},
        {name: 'admission.fob.name', label: 'Форма', sortable: true, field: 'admission.fob.name', opener: true},

        {name: 'isdop', label: 'Доп. набор', sortable: true, field: (row) => row.isdop ? 'да' : '', opener: true},

        //{name: 'admissionNumber', label: 'Мест', sortable: true, field: 'admissionNumber', opener: true},

        {
          name: 'admissionNumberTotal',
          label: 'Мест',
          sortable: true,
          field: 'admissionNumberTotal',
          opener: true
        },

        {name: 'usedNumber', label: 'Зачислено', sortable: true, field: 'usedNumber', opener: true},

        {name: 'nedobor', label: 'Недобор', sortable: true, field: (row) => row.admissionNumberTotal - row.usedNumber, opener: true},

        {name: 'appsCount', label: 'Заявлений УЧАСТВУЕТ', sortable: true, field: 'appsCount', opener: true},

        {name: 'ratio', label: 'Конкурс На место', sortable: true, field: 'ratio', opener: true},

        {
          name: 'admission.direct_name',
          label: 'Направление',
          sortable: true,
          field: 'admission.direct_name',
          opener: true
        },

        {name: 'id', label: 'ID', sortable: true, field: 'id', opener: true},

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
