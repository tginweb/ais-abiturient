<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :title="'Изменить набор ' + entityId"
    @hide="onHide"
    :loading="fetching"
  >

    {{entityId}}

    {{entity}}

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
        {label: 'Сохранить', callback: () => $router.push({})}
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      await this.fetchingMethod(async ()=>{
        this.entity = this.entity || await this.$store.dispatch('edu_admission/fetchAdmission', this.entityId)
      })
    },
  }
}

</script>

<style lang="scss" scoped>


</style>
