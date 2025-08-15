<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actionsClose="true"
    :loading="fetching"
    :title="'Взять в работу ' + entityId"
    @hide="onHide"
    dialogWidth="900px"
    v-if="entity"
  >


  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {},
  components: {},
  data() {
    return {
      tab: this.$store.getters['edu_ss_entrant/viewDefaultTab'],
      epguDocsSelectAll: false,
    }
  },
  computed: {

  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      await this.fetchingMethod(async () => {
        this.entity = this.entity || await this.$store.dispatch('edu_ss_entrant/querySingle', this.entityId)
      })
    },
  },

  watch: {
    tab(val) {
      this.$store.commit('edu_ss_entrant/VIEW_DEFAULT_TAB', val)
    },
    epguDocsSelectAll(val) {
      this.entity.epguDocs.forEach(doc => {
        doc.selected = val || null
      })
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
