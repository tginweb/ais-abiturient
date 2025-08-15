<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="'Событие заказа ' + entityId"
      dialog-width="650px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >

    <template v-slot:default="{entity}">

      <q-form ref="form" class="q-gutter-lg q-mb-md">

        <q-select
            v-model="form.eventCode"
            :options="orderEvents"
            emit-value
            label="Событие"
            map-options
            option-label="NAME"
            option-value="CODE"
            outlined
            class=""
        />

        <q-btn-toggle
            v-if="false"
            v-model="form.processor"
            toggle-color="grey-7"
            :options="[
              {label: 'Отправка клиенту', value: 'send'},
              {label: 'Просмотр', value: 'view'},
            ]"
        />

      </q-form>

      <iframe
          :src="renderUrl"
          v-if="renderUrl"
          class="full-width"
          :style="{
            border: 0,
            height: (scrollHeight-100) + 'px'
          }"
      />

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
  },
  components: {},
  apollo: {
    orderEvents: generateQueryInfo('orderEvents', require('../gql/order/query/events.gql')),
  },
  data() {
    return {
      orderEvents: [],
      form: {
        eventCode: 'SALE_NEW_ORDER',
        processor: 'mail'
      }
    }
  },
  computed: {

    renderUrl() {
      if (this.form.eventCode) {
        return this.$apiUrl('/main/template/render-event?ID=' + this.entityIdState + '&EVENT=' + this.form.eventCode + '&PREPROCESSOR=order')
      }
    },

    actions() {
      return [
        {
          label: 'Отправить клиенту',
          callback: this.onSubmitSend,
          loading: this.requestState.mutating
        },
      ]
    },
  },
  created() {
    this.fetch()
  },
  methods: {

    async onSubmitSendCommit() {
      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/order/mutation/event.gql'),
          variables: {
            id: this.entity.ID,
            eventCode: this.form.eventCode
          },
          state: this.requestState
        })
      } catch (e) {
        console.log(e)
      }
    },

    async onSubmitSend() {
      try {
        if (await this.$refs.form.validate())
          await this.onSubmitSendCommit()
      } catch (e) {
      }
    },

    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_admin/orderFetch', {
          id: this.entityIdState,
          options: {
            state: this.requestState,
            setFetched: false
          }
        })
        this.assignEntity(entity, this.requestState)
      } catch (e) {
        console.log(e)
      }
    },

  },
  watch: {}

}

</script>

<style lang="scss" scoped>


</style>
