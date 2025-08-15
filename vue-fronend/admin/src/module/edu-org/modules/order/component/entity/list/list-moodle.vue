<template>

  <ui-data-table
      v-bind="bind"
      @filterChange="$emit('filterChange', $event)"
      @update:nav="$emit('update:nav', $event)"
      @update:filterExpanded="$emit('update:filterExpanded', $event)"
  />

</template>

<script>

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";
import * as cells from "~module/edu-org/modules/order/component/entity/cell";

export default {
  mixins: [MTableProxy],
  props: {
    idField: {default: '_id'},
    nidField: {default: 'nid'},
    columnsVisible: {
      default: () => [
        'firstname',
        'lastname',
        'username',
        'password',
        'email',
        'profile_field_nabor',
        'profile_field_napr',
        'profile_field_year',
        'profile_field_finosnova',
        'profile_field_isistu',
        'profile_field_aisid',
        'subject_id',
        'subject_name'
      ]
    }
  },
  data() {
    return {
      columns: [

        {
          name: 'firstname',
          label: 'firstname',
          field: (row) => row.order.anket.personal.firstName + ' ' + row.order.anket.personal.secondName,
          sortable: true,
        },
        {
          name: 'lastname',
          label: 'lastname',
          field: (row) => row.order.anket.personal.lastName,
          sortable: true,
        },
        {
          name: 'username',
          label: 'username',
          field: 'username',
          sortable: true,
        },
        {
          name: 'password',
          label: 'password',
          field: 'password',
          sortable: true,
        },
        {
          name: 'email',
          label: 'email',
          field: 'order.email',
          sortable: true,
        },
        {
          name: 'profile_field_nabor',
          label: 'profile_field_nabor',
          field: 'order.firstApp.competition.admission.abbr',
          sortable: true,
        },
        {
          name: 'profile_field_napr',
          label: 'profile_field_napr',
          field: 'order.firstApp.competition.admission.direct_name',
          sortable: true,
        },
        {
          name: 'profile_field_year',
          label: 'profile_field_year',
          field: (row) => 2023,
          sortable: true,
        },
        {
          name: 'profile_field_finosnova',
          label: 'profile_field_finosnova',
          field: (row) => this.getFinosnova(row),
          sortable: true,
        },
        {
          name: 'profile_field_isistu',
          label: 'profile_field_isistu',
          field: (row) => '0',
          sortable: true,
        },
        {
          name: 'profile_field_aisid',
          label: 'profile_field_aisid',
          field: (row) => this.getAisId(row),
          sortable: true,
        },
        {
          name: 'subject_id',
          label: 'subject_id',
          field: 'csubject',
          sortable: true,
        },
        {
          name: 'subject_name',
          label: 'subject_name',
          field: 'subjectName',
          sortable: true,
        },
      ],
    }
  },
  methods: {
    getAisId(row) {
      if (row.order.snils) {
        return '2023_SNILS_' + row.order.snils
      } else if (row.order.ais.aisId) {
        return '2023_AIS_' + row.order.ais.aisId
      } else {
        return '2023_CIS_' + row.order.nid
      }
    },
    getFinosnova(row) {
      switch (row.order.firstApp.competition.csource) {
        case 1:
          return 1;
        case 4:
          return 2;
        case 3:
          return 3;
        default:
          return 1;
      }
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
