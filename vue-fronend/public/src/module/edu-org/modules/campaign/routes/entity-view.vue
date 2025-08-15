<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    :title="'Просмотр кампании ' + entityId"
    @hide="onHide"
    dialogWidth="700px"
  >

    <ui-data-tree-view
      v-if="entity"
      :data="entityViewTree"
      :expanded="['Общее']"
    />

  </component>

</template>

<script>

import MVroute from '@common/router/mixin/vroute'

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
          {label: 'Наименование', value: entity.name},
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
        this.entity = this.entity || await this.$store.dispatch('edu_campaign/fetchEntity', this.entityId)
      })
    },
  }
}

</script>

<style lang="scss" scoped>


</style>
