<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :loaded="fetched"
      :title="'Просмотр сообщения ' + entityId"
      dialogWidth="900px"
      @hide="onHide"
  >

    <template v-slot:default>

      <ui-menu-toolbar
          :args="toolbarArgs"
          :items="entity.actions"
          :rootOutline="true"
          class="q-mb-md"
          @actionResolve="onActionResolve"
      />

      <q-form ref="form">

        <q-tabs
            v-model="tab"
            active-bg-color="secondary"
            active-color="white"
            align="justify"
            class=" text-primary"
            dense
            indicator-color="white"
            narrow-indicator
        >
          <q-tab label="Общее" name="common"/>
          <q-tab label="Запрос" name="request"/>
          <q-tab label="Ответ" name="response"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated>

          <q-tab-panel class="q-px-none" name="common">

            <json-viewer :value="entity"></json-viewer>

          </q-tab-panel>

          <q-tab-panel class="q-px-none" name="request">

            <div class="q-gutter-y-md">

              <q-input
                  v-model="headerProxy"
                  input-style="height: 100px"
                  label="Header"
                  outlined
                  type="textarea"
              />

              <q-input
                  v-model="entity.request.payloadXml"
                  input-style="height: 35vh; white-space: nowrap;"
                  label="Payload"
                  outlined
                  type="textarea"
              />

              <q-input
                  v-model="entity.request.token"
                  input-style="height: 35vh"
                  label="Токен"
                  outlined
                  type="textarea"
              />

            </div>

          </q-tab-panel>


          <q-tab-panel class="q-px-none" name="response">

            <div class="q-gutter-y-md">

              <q-input
                  :value="JSON.stringify(entity.response, null, 2)"
                  input-style="height: calc(100vh - 400px)"
                  label="Header"
                  outlined
                  type="textarea"
              />

            </div>

          </q-tab-panel>

        </q-tab-panels>

      </q-form>

    </template>


  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {}
  },
  components: {},
  data() {
    return {
      tab: 'common',

    }
  },
  computed: {
    headerProxy: {
      get: function () {
        const val = this.$util.base.cloneDeep(this.entity.request.header)
        delete val.__typename
        return JSON.stringify(val, null, 2)
      },
      set: function (val) {
        this.entity.request.header = JSON.parse(val)
      }
    },

    toolbarArgs() {
      return {
        id: parseInt(this.entityId)
      }
    },

    actions() {
      return [
        {
          label: 'Сохранить',
          callback: this.onSave
        },
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
        ]
      })

      return res
    }
  },
  created() {
    this.fetch()
  },
  methods: {


    async onActionResolve() {
      await this.fetch()
    },

    async onSave() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          await this.mutationMethod(async () => {

            try {

              let {data: {res: {result}}} = await this.$apollo.mutate({
                mutation: require('../gql/mutation/save.gql'),
                variables: {
                  model: this.entity,
                }
              })

              console.log(result)

              this.$bus.emit('processMessages', result.messages);

              if (this.onResolve)
                this.onResolve()

            } catch (e) {

              console.log(e)
            }

          })

        }

      }).catch((e) => {

      })

    },
    async fetch() {
      await this.fetchingMethod(async () => {
        if (this.entityId)
          this.entity = this.entityData || await this.$store.dispatch('edu_epgu_message/entityQuerySingle', {id: parseInt(this.entityId)})
      })
    },

  },

}

</script>

<style lang="scss" scoped>


</style>
