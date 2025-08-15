<template>

  <div>

    <ui-data-table
        @update:nav="$emit('update:nav', $event)"
        @filterChange="$emit('filterChange', $event)"
        v-bind="bind"
        v-if="mode==='table'"
    />
    <div v-else-if="mode==='pivot'">
       {{rowsReport}}
    </div>

  </div>

</template>

<script>

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  props: {
    idField: {default: 'nid'},
    nidField: {default: 'nid'},
  },
  data() {
    return {
      columns: [
        {
          name: 'person',
          label: 'Персона',
          field: (row, get) => [
            get(row, 'anket.personal.lastName'),
            get(row, 'anket.personal.firstName'),
            get(row, 'anket.personal.secondName'),
          ].join(' '),
          sortable: true,
          sticky: true
        },
        {
          name: 'userId',
          label: 'Пользователь',
          field: 'row.user.email',
          sortable: true,
        },
        {
          name: 'admissionFobName',
          label: 'Форма',
          field: 'app.admission.fob.name',
          sortable: true,
        },
        {
          name: 'admissionSourceName',
          label: 'Основа',
          field: 'app.source.name',
          sortable: true,
        },
        {
          name: 'admissionName',
          label: 'Направление аббр',
          field: 'app.admission.name',
          sortable: true,
        },
        {
          name: 'admissionDirectName',
          label: 'Направление имя',
          field: 'app.admission.direct_name',
          sortable: true,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
