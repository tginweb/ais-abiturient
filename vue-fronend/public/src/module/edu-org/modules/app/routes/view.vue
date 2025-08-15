<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :loaded="fetched"
      :title="'Заявление ' + entityId"
      @hide="onHide"
      dialogWidth="1150px"
      v-if="entity"
  >
    <template v-slot:default>

      <div class="row q-col-gutter-lg">
        <div class="col-12">
          <ui-admin-data-card
              title="Общие"
              :fields="fields"
          />

        </div>
        <div class="col-12">
          <ui-admin-data-card
              title="Абитуриент"
              :fields="fieldsAbit"
          />
        </div>
      </div>


    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'


export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {
  },
  data() {
    return {
      tab: 'common',
      tabEntities: 'source',
      dialogIs: 'ui-admin-dialog',
      epguDocsSelectAll: false,

      appActiveSelectAll: false,
      appDisableSelectAll: false,

      selectedAppsActive: {},
      selectedAppsDisable: {},
    }
  },
  computed: {
    fields() {
      const res = []

      res.push({
        value: this.entity._id,
        label: 'ID'
      })

      res.push({
        value: this.entity.nid,
        label: 'NID'
      })

      res.push({
        value: this.entity.admission.name,
        label: 'Набор'
      })

      res.push({
        value: this.entity.admission.direct_name,
        label: 'Направление'
      })

      res.push({
        value: this.entity.source.nameShort,
        label: 'Конкурс'
      })

      return res
    },

    fieldsAbit() {
      const res = []

      const personal = this.entity.order.anket.personal

      res.push({
        value: [personal.lastName, personal.firstName, personal.secondName].join(' '),
        label: 'ФИО'
      })

      res.push({
        value: personal.snils,
        label: 'СНИЛС'
      })

      return res
    },
  },
  created() {
    this.fetch()
  },

  methods: {

    async fetch(refetch) {


      await this.fetchingMethod(async () => {
        this.entity = !refetch && this.entityData || await this.$store.dispatch('edu_app/entityQuerySingle', {id: this.entityId})
      })
    },

  },
  watch: {


  }
}

</script>

<style lang="scss" scoped>


</style>
