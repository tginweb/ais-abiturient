<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :loaded="requestState.fetched"
    :loading="requestState.fetching"
    :title="'Абитуриент ' + (entity && entity.fio)"
    @hide="onHide"
    dialogWidth="900px"
  >
    <template v-slot:default="ctx" v-if="entity">
      <q-tabs
          v-model="tab"
          active-bg-color="secondary"
          active-color="white"
          align="justify"
          class=" text-secondary bg-grey-4"
          dense
          indicator-color="white"
          narrow-indicator

      >
        <q-tab label="Данные" name="common"/>
        <q-tab label="Документы" name="docs"/>
        <q-tab label="Достижения" name="achievements"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>

        <q-tab-panel class="q-px-none" name="common">

          <div class="q-mb-md s-font-xl">Общее</div>

          <json-viewer :value="entity"/>

          <json-viewer :value="entity.epgu" :expand-depth="2"/>

        </q-tab-panel>

      </q-tab-panels>
    </template>
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


      this.entity = await this.$store.dispatch('gql/fetch', {
        query: require('../gql/query/single.gql'),
        variables: {
          filter: {
            _id: {eq: this.entityId},
          },
        },
        state: this.requestState,
      })
    },
  },

  watch: {

  }
}

</script>

<style lang="scss" scoped>


</style>
