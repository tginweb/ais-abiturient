<template>

  <ui-data-table
      v-bind="bind"
      @filterChange="$emit('filterChange', $event)"
      @update:nav="$emit('update:nav', $event)"
      @update:filterExpanded="$emit('update:filterExpanded', $event)"
  />

</template>

<script>

import * as cells from '../cell'

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  props: {
    idField: {default: '_id'},
    nidField: {default: 'nid'},
    columnsVisible: {
      default: () => [
        'nid',
        'person',
        'ordersource',
        'podldoc',
        'podldocEpguRecieved',
        'podldocOrg',
        'flags',
        'firstApp',
        'achievements',
        'ais',
        'epgu',
        'prevEduLevelName',
        'apps_new',
        //'apps_old',
        //'state_old',
        'czakaz',
        'flags',
        'state',
        'subjects',
        'institute',
        //'operatorUser',
        //'chat',
        //'sendDate',
        'aisPorted',
        'decree',
        'aisDecree',
        'prezach',
        'phone',
        'email',
        'specs',
        'docs',
        'prezachAdmissionName',
        'fis'
        //'prezachAdmissionFacName'
      ]
    }
  },
  data() {
    return {
      columns: [
        {
          name: 'nid',
          label: 'ID - тип',
          com: cells.id,
          field: 'nid',
          sortable: true,
        },
        {
          name: 'person',
          label: 'Персона',
          com: cells.person,
          field: 'fio',
          sortable: true,
          sticky: true,
        },
        {
          name: 'fis',
          label: 'ФИС',
          com: cells.fis,
          sortable: true,
        },
        {
          name: 'snils',
          label: 'СНИЛС',
          field: 'snils',
          table: false,
          sortable: true,
        },
        {
          name: 'czakaz',
          label: 'Заказчик',
          field: 'czakaz',
          sortable: true,
        },
        {
          name: 'lgots',
          label: 'Льготы',
          com: cells.docs,
          field: (row) => {
            const res = {}
            for (const doc of row.docs.filter(doc => doc.type === 'lgot')) {
              res[doc.docTypeName] = doc.docTypeName
            }
            return Object.values(res).join('; ')
          },
          sortable: true,
        },
        {
          name: 'specs',
          label: 'Специальности',
          com: cells.specs,
          field: (row) => {
            const res = {}
            for (const app of row.applications.items) {
              for (const spec of app.specsAdmissions) {
                const name = spec.abbr + ' ' + spec.spec_name
                res[name] = name
              }
            }
            return Object.values(res).join('; ')
          },
          sortable: true,
        },
        {
          name: 'ordersource',
          label: 'Создано',
          com: cells.source,
          sortable: true,
          sticky: false,
        },
        {
          name: 'podldoc',
          label: 'ПОДЛ. ПЕЧАТНЫЙ',
          com: cells.podldocPrint,
          sortable: true,
          sticky: false,
        },
        {
          name: 'podldocEpguRecieved',
          label: 'ПОДЛ. ЕПГУ',
          field: 'podldocEpguRecieved',
          com: cells.podldocEpgu,
          sortable: true,
          sticky: false,
        },
        {
          name: 'podldocOrg',
          label: 'ПОДЛ ОО',
          field: 'podldocOrg',
          com: cells.podldocOrg,
          sortable: true,
          sticky: false,
        },
        {
          name: 'decree',
          label: 'Приказ',
          com: cells.decree,
          sortable: true,
          sticky: false,
        },
        {
          name: 'aisDecree',
          label: 'Приказ АИС',
          com: cells.aisDecree,
          sortable: true,
          sticky: false,
        },
        {
          name: 'prezach',
          label: 'Будет зачислен на',
          com: cells.prezach,
          field: 'prezachCompetition.name',
          sortable: true,
          sticky: false,
        },
        {
          name: 'prezachAdmissionName',
          label: 'Зачислен на направление',
          field: 'prezachCompetition.admission.direct_name',
          sortable: true,
        },
        {
          name: 'prezachAdmissionFacName',
          label: 'Зачислен на факультет',
          field: 'prezachCompetition.admission.fac.name',
          sortable: true,
        },
        {
          name: 'appsErrors',
          label: 'Есть ошибки конкурсов',
          field: (row) => {
            const types = row.appsErrors.reduce((map, item) => {
              map[item.type] = 1
              return map
            }, {})
            const typeName = {
              dismatch: 'Конкурсы или приоритеты отличается между платформами (старый ЛК, ЕПГУ, АИС)',
              disordered: 'Неверный порядок приоритетов',
            }
            const res = Object.keys(types).map(type => typeName[type])
            return res.length ? '<ul><li>' + res.join('</li><li>') + '</li></ul>' : ''
          },
          sortable: true,
          sticky: false,
        },
        {
          name: 'state',
          label: 'Состояние',
          com: cells.state,
          field: 'state.statusInfo.titleAdmin',
          sortable: true,
          head: {
            style: {
              textAlign: 'center'
            }
          }
        },
        {
          name: 'state_old',
          label: 'Состояние - в ЛК',
          com: cells.state_old,
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
          name: 'chat',
          label: 'Чат',
          com: cells.chat,
          reportField: false,
          sortable: true,
        },
        {
          name: 'institute',
          label: 'Дело на факультете',
          com: cells.institute,
          field: 'institute.name',
          sortable: true,
        },
        {
          name: 'firstApp',
          label: 'Заявление высш. пр-та',
          com: cells.firstApp,
          field: (row) => {
            return row.firstApp && row.firstApp.competition ? row.firstApp.competition.name : ''
          },
          sortable: true,
        },

        {
          name: 'apps_new',
          label: 'Направления',
          com: cells.apps_new,
          sortable: true,
        },
        {
          name: 'apps_old',
          label: 'Направления',
          com: cells.apps_old,
          reportField: false,
          sortable: true,
        },

        {
          name: 'prevEduLevelName',
          label: 'Предыдущее обр-ие',
          field: 'prevEduLevelName',
          sortable: true,
          sticky: false,
        },
        {
          name: 'phone',
          label: 'Телефон',
          field: 'phone',
          sortable: true,
        },
        {
          name: 'email',
          label: 'E-mail',
          field: 'email',
          sortable: true,
        },
        {
          name: 'ais',
          label: 'АИС',
          com: cells.ais,
          sortable: true,
        },
        {
          name: 'epgu',
          label: 'ЕПГУ',
          com: cells.epgu,
          sortable: true,
        },

        /*
        {
          name: 'flags',
          label: 'ИД',
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
         */


      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
