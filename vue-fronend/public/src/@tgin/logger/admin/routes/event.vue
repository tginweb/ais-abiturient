<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :title="'Событие ' + entityId"
      dialog-width="1150px"
      @hide="onHide"
  >
    <template v-slot:default="{entity}">

      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-md-12 q-gutter-lg">
          <ui-admin-data-card
              title="Общие данные"
              :fields="sectionCommon"
          />
          <ui-admin-data-card
              title="Сообщение"
              :fields="sectionMessage"
          />
        </div>
        <div class="col-md-12 q-gutter-lg">

          <ui-admin-data-card
              title="Сессия"
              :fields="sectionSession"
          />

          <ui-admin-data-card
              title="Api"
              :fields="sectionApi"
          >
            <template v-slot:value-apiArgs="ctx">
              <json-viewer
                  :value="entity.apiArgs"
                  :expand-depth=1
                  sort
              />
            </template>
            <template v-slot:value-apiResult="ctx">
              <json-viewer
                  :value="entity.apiResult"
                  :expand-depth=1
                  sort
              />
            </template>
          </ui-admin-data-card>

        </div>
      </div>

    </template>

  </component>

</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  props: {},
  components: {},
  data() {
    return {}
  },
  computed: {
    sectionCommon() {

      const result = []

      result.push({
        label: 'ID',
        value: this.entity.ID,
      })

      result.push({
        label: 'Дата',
        value: this.$util.date.timestampToFormat(this.entity.created, 'DD.MM.YYYY HH:mm'),
      })

      result.push({
        label: 'Таймер',
        value: (this.entity.timer / 1000) + ' сек.',
      })

      return result
    },

    sectionMessage() {

      const result = []

      if (this.entity.type)
        result.push({
          label: 'Тип:',
          value: this.entity.type,
        })

      if (this.entity.name)
        result.push({
          label: 'Имя:',
          value: this.entity.name,
        })

      if (this.entity.message)
        result.push({
          label: 'Сообщение:',
          value: this.entity.message,
        })

      return result
    },

    sectionSession() {

      const result = []

      if (this.entity.userId)
        result.push({
          label: 'User:',
          value: this.entity.userId,
        })

      if (this.entity.fuserId)
        result.push({
          label: 'Fuser:',
          value: this.entity.fuserId,
        })

      if (this.entity.vorderId)
        result.push({
          label: 'Vorder:',
          value: this.entity.vorderId,
        })


      if (this.entity.sessionId)
        result.push({
          label: 'Session:',
          value: this.entity.sessionId,
        })

      return result
    },

    sectionApi() {

      const result = []

      if (this.entity.apiType)
        result.push({
          label: 'apiType:',
          value: this.entity.apiType,
        })

      if (this.entity.apiMethod)
        result.push({
          label: 'apiMethod:',
          value: this.entity.apiMethod,
        })

      if (this.entity.apiPath)
        result.push({
          label: 'apiPath:',
          value: this.entity.apiPath,
        })

      result.push({
        name: 'apiArgs',
        label: 'apiArgs:',
      })

      result.push({
        name: 'apiResult',
        label: 'apiResult:',
      })

      return result
    },

    actions1() {
      return [
        {
          label: 'Сохранить',
          color: 'primary',
          callback: this.onSubmit
        }
      ]
    },

  },
  created() {
    this.fetch()
  },

  methods: {

    async fetch() {
      try {
        const entity = await this.$store.dispatch('gql/fetch', {
          query: require('../gql/event/query/single.gql'),
          fetchPolicy: 'no-cache',
          variables: {
            filter: {
              ID: {eq: this.entityId},
            },
          },
          state: this.requestState,
          setFetched: false
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

/deep/ {
  .jv-code {
    padding: 0;
  }
}

</style>
