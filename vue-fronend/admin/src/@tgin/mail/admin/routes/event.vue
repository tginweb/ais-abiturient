<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :title="'Событие ' + entityId"
      dialog-width="1150px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >
    <template v-slot:default="{entity}">

      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-md-11 q-gutter-lg">

          <ui-admin-data-card title="Общие данные" :fields="sectionCommon"/>

          <ui-admin-data-card title="Поля">
            <json-viewer
                :value="entity.FIELDS"
                :expand-depth=1
                v-if="entity.FIELDS"
                sort
            />
          </ui-admin-data-card>

        </div>
        <div class="col-md-13 q-gutter-lg">


          <ui-admin-data-card title="Просмотр">
            <iframe
                :src="eventRenderUrl"
                v-if="eventRenderUrl"
                class="full-width border-1 border-grey-5 q-pa-md"
                :style="{height: (scrollHeight-100) + 'px'}"
            />
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
    eventRenderUrl() {

      if (this.entity) {
        return this.$apiUrl('/main/template/render-event?EVENT_ID=' + this.entityIdState + '&EVENT_TYPE_NAME=' + this.entity.EVENT_NAME)
      }
    },
    sectionCommon() {

      const result = []

      result.push({
        label: 'ID',
        value: this.entity.ID,
      })

      result.push({
        label: 'Дата создания',
        value: this.entity.DATE_INSERT
      })

      result.push({
        label: 'Код события',
        value: this.entity.EVENT_NAME
      })

      result.push({
        label: 'Наименование события',
        value: this.entity.EVENT && this.entity.EVENT.NAME
      })

      result.push({
        label: 'Шаблон',
        value: this.entity.MESSAGE_ID
      })

      result.push({
        label: 'Номер / ID заказа',
        value: this.entity.ORDER ? this.entity.ORDER.ACCOUNT_NUMBER + ' / ' + this.entity.ORDER.ID : this.entity.ORDER_ID
      })

      result.push({
        label: 'Пользователь',
        value:
            this.entity.USER && ((this.entity.USER ? this.entity.USER.LOGIN : null) + ' [' + this.entity.USER_ID + ']') ||
            this.entity.ORDER && ((this.entity.ORDER.USER ? this.entity.ORDER.USER.LOGIN : '') + ' [' + this.entity.ORDER.USER_ID + ']')
      })

      result.push({
        label: 'Дата отправки',
        value: this.entity.DATE_EXEC
      })

      result.push({
        label: 'Успешно отправлено',
        value: this.entity.SUCCESS_EXEC ? 'да' : 'нет'
      })

      return result
    },


  },
  created() {
    this.fetch()
  },

  methods: {

    async fetch() {
      console.log(this.entityId)

      try {
        const entity = await this.$store.dispatch('gql/fetch', {
          query: require('../gql/event/query/single.gql'),
          fetchPolicy: 'no-cache',
          variables: {
            filter: {
              ID: {eq: this.entityIdState},
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
