<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :actions="actions"
      :loading="fetching"
      :path="pagePathFull"
      dialogWidth="660px"
      title="Адрес доставки"
      @hide="onHide"
  >

    <CView
        v-if="entity"
        ref="view"
        :action="action"
        :entity="entity"
        :canDelete="canDelete"
        @saved="onSavedEvent"
        :actions.sync="actions"
    />

  </component>

</template>

<script>

import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

import CView from '../../component/order/profile/edit'

export default {
  name: 'page.profile',
  mixins: [MRoute, MVRoute],
  components: {
    CView
  },
  props: {
    item: {},
    id: {},
    action: {default: 'edit'},
    onSaved: {},
    context: {},
    canDelete: {default: true},
    personTypeId: {}
  },
  data() {
    return {
      page: {
        title: 'Адрес доставки',
      },
      actions: []
    }
  },
  computed: {},
  methods: {
    async fetch() {


      if (this.action === 'create') {
        this.entity = await this.$store.dispatch('gql/fetch', {
          query: require('../../gql/profile/query/form.gql'),
          variables: {
            personTypeId: parseInt(this.personTypeId)
          },
          state: this.requestState,
        })
      } else {
        this.entity = await this.$store.dispatch('gql/fetch', {
          query: require('../../gql/profile/query/form.gql'),
          variables: {
            id: parseInt(this.entityId),
          },
          state: this.requestState,
        })
      }
    },
    onSavedEvent(action, profile) {
      if (this.onSaved) {
        this.onSaved(action, profile)
      }
      this.visible = false
    }
  },
  async created() {
    await this.fetch();
  }
}
</script>
<style lang="scss" scoped>


</style>
