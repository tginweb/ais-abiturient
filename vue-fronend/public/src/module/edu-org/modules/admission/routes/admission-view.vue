<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :loading="fetching"
    :title="'Просмотр набора ' + entityId"
    @hide="onHide"
  >

    <ui-data-tree-view
      v-if="entity"
      :data="entityViewTree"
      :expanded="['Общее']"
    />

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {},
  components: {},
  data() {
    return {}
  },
  computed: {
    actions() {
      return [
        {
          label: 'Изменить',
          callback: () => this.$router.push({
            path: '/admin/edu/admission/' + this.entityId + '/edit',
            query: {vroute: true}
          }, () => {
          }, () => {
          })
        }
      ]
    },

    entityViewTree() {

      const res = []

      const entity = this.entity

      res.push({
        label: 'Общее',
        expanded: true,
        children: [
          {label: '_id', value: entity._id},
          {label: 'ID', value: entity.id},
          {label: 'Аббривиатура', value: entity.abbr},
          {label: 'Год', value: entity.yr}
        ]
      })

      if (entity.subjects && entity.subjects.length) {

        let rows = []

        entity.subjects.forEach((subject) => {

          let subjectName
          let subjectRows = [
            {label: 'ID', value: subject.csubject}
          ]

          if (subject.subject) {
            subjectName = subject.subject.name
            subjectRows.push(
              {label: 'Name', value: subject.subject.name}
            )
          } else {
            subjectName =  'Предмет ' + subject.csubject
          }

          subjectRows.push(
            {label: 'Минимальный балл', value: subject.minimal}
          )

          subjectRows.push(
            {label: 'Номер', value: subject.number}
          )

          rows.push({
            label: subjectName,
            children: subjectRows
          })
        })

        res.push({
          label: 'Предметы',
          children: rows
        })
      }

      if (entity.direction)
        res.push({
          label: 'Направление',
          children: [
            {label: '_id', value: entity.direction._id},
            {label: 'ID', value: entity.direction.id},
            {label: 'Cod', value: entity.direction.cod},
            {label: 'Name', value: entity.direction.name},
            {label: 'Cperson', value: entity.direction.cperson},
            {label: 'Cugspec', value: entity.direction.cugspec},
            {label: 'Dubl', value: entity.direction.dubl},
            {label: 'Abbr', value: entity.direction.abbr},
            {label: 'Code', value: entity.direction.code},
          ]
        })


      return res
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      await this.fetchingMethod(async () => {
        this.entity = this.entity || await this.$store.dispatch('edu_admission/fetchAdmission', this.entityId)
      })
    },
  }
}

</script>

<style lang="scss" scoped>


</style>
