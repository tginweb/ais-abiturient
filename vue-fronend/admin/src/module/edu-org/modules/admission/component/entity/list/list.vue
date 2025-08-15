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

        {
          name: 'epguExport',
          label: 'epguExport',
          sortable: true,
          field: (row) => row.epguExport ? 'да' : '',
          opener: true
        },

        {name: 'yr', label: 'yr', sortable: true, field: 'yr', opener: true},

        {name: 'name', label: 'Имя', sortable: true, field: 'name', opener: true},
        {name: 'direct_name', label: 'Направление', sortable: true, field: 'direct_name', opener: true},
        {name: 'cdirection', label: 'Направление спр', sortable: true, field: 'direction.name', opener: true},
        {name: 'spec_name', label: 'Специальность', sortable: true, field: 'spec_name', opener: true},

        {name: 'cfac', label: 'cfac', sortable: true, field: 'cfac', opener: true},
        {name: 'level', label: 'Уровень', sortable: true, field: 'level.name', opener: true},
        {name: 'cfob', label: 'Форма', sortable: true, field: 'fob.name', opener: true},

        {name: 'okso', label: 'ОКСО', sortable: true, field: 'direction.cod', opener: true},
        {name: 'campaign', label: 'Кампания', sortable: true, field: 'campaign.name', opener: true},

        {name: 'budgCount', label: 'Бюд ВЕСЬ', sortable: true, field: 'budgCount', opener: true},
        {name: 'budgPlaces', label: 'Бюд', sortable: true, field: 'budgPlaces', opener: true},
        {name: 'lgotQuota', label: 'Квота', sortable: true, field: 'lgotQuota', opener: true},
        {name: 'specQuota', label: 'Спец квота', sortable: true, field: 'specQuota', opener: true},
        {name: 'celevQuota', label: 'Цел', sortable: true, field: 'celevQuota', opener: true},
        {name: 'comercCount', label: 'Ком', sortable: true, field: 'comercCount', opener: true},
        {
          name: 'subjectsHaveOptional',
          label: 'Опц',
          sortable: true,
          field: (row) => row.subjectsHaveOptional ? 'да' : '',
          opener: true
        },

        {
          name: 'competCount',
          label: 'Конкурсов',
          sortable: true,
          field: (row) => row.competitionsList.length,
          opener: true
        },

        {
          name: 'subjectsNew',
          label: 'Предметы',
          sortable: true,
          com: cells.subjects,
          opener: true
        },
        {name: 'actions', label: 'Действия', sortable: true, actions: true},
      ],
    }
  },
  computed: {
    subrowsMenu() {

      const res = []

      res.push({
        label: 'ЕПГУ',
        children: [
          {
            label: 'Синхронизировать',
            confirm: true,
            type: 'dispatch',
            path: 'edu_epgu_task/entityAddFromTargets',
            params: {
              action: 'sync'
            }
          },
          {
            label: 'Удалить',
            confirm: true,
            type: 'dispatch',
            path: 'edu_epgu_task/entityAddFromTargets',
            params: {
              action: 'delete'
            }
          },
        ]
      })

      return res
    },

    rowsMenuComp() {
      const res = []

      res.push({
        label: 'ЕПГУ',
        children: [
          {
            label: 'Наборы',
            children: [
              {
                label: 'Синхронизировать',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'sync',
                  entityType: 'edu_admission',
                }
              },
              {
                label: 'Удалить',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'delete',
                  entityType: 'edu_admission',
                }
              },
            ]
          },
          {
            label: 'Конкурсы',
            children: [
              {
                label: 'Синхронизировать',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'sync',
                  entityType: 'edu_admission',
                  scope: 'competition'
                }
              },
              {
                label: 'Удалить',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'delete',
                  entityType: 'edu_admission',
                  scope: 'competition'
                }
              },
            ]
          },
          {
            label: 'Программы',
            children: [
              {
                label: 'Синхронизировать',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'sync',
                  entityType: 'edu_admission',
                  scope: 'competition.program'
                }
              },
              {
                label: 'Удалить',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'delete',
                  entityType: 'edu_admission',
                  scope: 'competition.program'
                }
              },
            ]
          },
          {
            label: 'Испытания',
            children: [
              {
                label: 'Синхронизировать',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'sync',
                  entityType: 'edu_admission',
                  scope: 'competition.test'
                }
              },
              {
                label: 'Удалить',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'delete',
                  entityType: 'edu_admission',
                  scope: 'competition.test'
                }
              },
            ]
          },
          {
            label: 'Испытания - даты',
            children: [
              {
                label: 'Синхронизировать',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'sync',
                  entityType: 'edu_admission',
                  scope: 'competition.test.location'
                }
              },
              {
                label: 'Удалить',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_task/entityAddFromEntities',
                params: {
                  action: 'delete',
                  entityType: 'edu_admission',
                  scope: 'competition.test.location'
                }
              },
            ]
          },
        ]
      })

      res.push({
        label: 'Синхронизировать с',
        nonav: true,
        children: [
          {
            label: 'Объемами приема',
            type: 'dispatch',
            path: 'edu_volume/syncWithAdmissions',
          },
          {
            label: 'Образовательными программами',
            type: 'dispatch',
            path: 'edu_program/syncWithAdmissions',
          },
        ]
      })

      res.push({
        label: 'Заполнить 1',
        confirm: true,
        type: 'dispatch',
        path: 'edu_admission/entityFill',
      })

      return res
    }
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
