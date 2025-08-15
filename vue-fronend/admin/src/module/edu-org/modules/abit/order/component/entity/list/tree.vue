<template>

  <div>
    <TreeTable :value="nodes">
      <Column field="name" header="name" :expander="true" headerClass="name" headerStyle="width: 40%" bodyStyle="white-space: nowrap;">
        <template #header>
          <Button type="button" icon="pi pi-cog"></Button>
        </template>
        <template #body="slotProps">
          sss
        </template>
      </Column>
      <Column field="lk" header="ЛК"></Column>
      <Column field="ais" header="АИС"></Column>
      <Column field="epgu" header="ЕПГУ"></Column>
    </TreeTable>
  </div>

</template>

<script>

import * as cells from '../cell'

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import {deepGet} from "@tgin/main/common/lib/util/base";

export default {
  mixins: [MTableProxy],
  components: {
    TreeTable,
    Column
  },
  props: {
    idField: {default: '_id'},
    nidField: {default: 'nid'},
    columnsVisible: {
      default: () => [
        'nid',
        'person',
        'userId',
        'TAGS',
        'apps_new',
        'apps',
        'agreementChangedDate',
        'flags',
        'state',
        'subjects',
        'institute',
        'operatorUser',
        'chat',
        'sendDate',
        'aisPorted',
      ]
    }
  },
  data() {
    return {
      columns: [
        {
          name: 'person',
          label: 'Персона',
          com: cells.person,
          field: 'fio',
          sortable: true,
          sticky: true,
        },
        {
          name: 'userId',
          label: 'ID юзера',
          com: cells.user,
          field: 'user.nid',
          sortable: true,
        },
        {
          name: 'state',
          label: 'Состояние',
          com: cells.state,
          field: 'state.status',
          sortable: true,
          head: {
            style: {
              textAlign: 'center'
            }
          }
        },
        {
          name: 'operatorUser',
          label: 'Оператор',
          field: (row) => row.operator ? [row.operator.lastName, row.operator.firstName].join(' ') : '',
          sortable: true,
        },
        {
          name: 'sendDate',
          label: 'Отправлена',
          field: (row) => row.sendDate ? '' + this.$util.date.timestampToFormat(row.sendDate, 'DD MMMM HH:mm') + '' : '',
          sortable: true,
          align: 'center'
        },
        {
          name: 'agreementChangedDate',
          label: 'Согл. ИЗМ',
          com: cells.agreement,
          field: 'agreementChangedDate',
          type: 'datetime',
          sortable: true,
        },
        {
          name: 'aisPorted',
          label: 'В АИС',
          com: cells.ais,
          sortable: true,
        },
        {
          name: 'institute',
          label: 'Институт',
          field: 'institute.name',
          sortable: true,
        },

        {
          name: 'chat',
          label: 'Чат',
          com: cells.chat,
          reportField: false,
          sortable: true,
        },

        {
          name: 'apps_new',
          label: 'Направления - new',
          com: cells.apps_new,
          sortable: true,
        },

        {
          name: 'apps',
          label: 'Направления',
          com: cells.apps,
          reportField: false,
          sortable: true,
        },

        {
          name: 'flags',
          label: 'Идвидуальные достижения и льготы',
          com: cells.flags,
          sortable: true,
        },
        {
          name: 'subjects',
          label: 'Предметы',
          com: cells.subjects,
          sortable: true,
        },
        {
          name: 'dates',
          label: 'Даты',
          com: cells.dates,
          sortable: true,
        },
        {
          name: 'quantity',
          label: 'Количество',
          field: () => 1,
          sortable: true,
        },
        {
          name: 'epgu',
          label: 'ЕПГУ',
          com: cells.epgu,
          sortable: true,
        },


        {
          name: 'fob_name',
          label: 'Форма',
          field: 'app.admission.fob.name',
          table: false,
          sortable: true,
        },
        {
          name: 'source_name',
          label: 'Основа',
          field: 'app.source.name',
          table: false,
          sortable: true,
        },
        {
          name: 'app_abbr',
          label: 'Набор',
          field: 'app.admission.name',
          table: false,
          sortable: true,
        },
        {
          name: 'app_direction_name',
          label: 'Направление',
          field: 'app.admission.direct_name',
          table: false,
          sortable: true,
        },
      ],
    }
  },

  computed: {

    nodes() {
      return this.bind.rows.map((row) => {
        return {
          key: 'order-' + row._id,
          data: {
            name: row.fio + ' СНИЛС: ' + row.snils,
            lk: row.state.statusInfo.titleAdmin
          },
          children: [
            {
              key: row._id + '.apps',
              data: {
                name: 'Конкурсы',
              },
              children: row.apps.map(app => {
                return {
                  key: 'app-' + app._id,
                  data: {
                    name: this.$util.base.deepGet(app, 'admission.name'),
                    col1: this.$util.base.deepGet(app, 'source.name'),

                    ais: 'ais',
                    epgu: 'epgu',
                  },
                }
              })
            }
          ]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

/deep/ {
  th.name {
    width: 550px;
  }
}

/deep/ {
  .p-treetable .p-treetable-thead > tr > th {
    position: sticky;
    top: 0;
    z-index: 10;
  }
}

</style>
