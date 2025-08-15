<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :title="'Тег ' + entityId"
      dialog-width="600px"
      @hide="onHide"
  >
    <template v-slot:default="{entity}">

      <q-form ref="form" class="q-pb-lg">

        <div class="row q-col-gutter-md q-col-gutter-xl-md">

          <q-input
              label="Наименование"
              v-model="entityState.name"
              class="col-24"
              outlined
              :rules="[
                val => !!val || 'Обязательное поле'
              ]"
          />

          <q-input
              outlined
              label="Цвет"
              v-model="entityState.color"
              class="col-12"
          >
            <template v-slot:append>
              <q-btn :style="{backgroundColor: entityState.color}"/>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-color v-model="entityState.color"/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

        </div>

      </q-form>


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


      return result
    },

    actions() {
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

    async onSubmit() {

      const entity = this.entityForSave(this.entityState)

      try {

        const res = await this.$store.dispatch('gql/mutation', {
          dispatch: 'tagger_admin/apiMutate',
          payload: {
            mutation: 'save',
            action: this.actionState,
            model: entity,
          },
          state: this.requestState
        })

        this.actionState = 'update'

        if (this.onSuccess)
          this.onSuccess()

        this.visible = false

      } catch (e) {
        console.log(e)
      }
    },

    async fetch() {


      if (this.action === 'create') {
        this.assignEntity({
          name: null,
          color: null
        }, this.requestState)
      } else {
        try {
          const entity = await this.$store.dispatch('gql/fetch', {
            query: require('../gql/tag/query/single.gql'),
            fetchPolicy: 'no-cache',
            variables: {
              filter: {
                id: {eq: this.entityId},
              },
            },
            state: this.requestState,
            setFetched: false
          })
          this.assignEntity(entity, this.requestState)
        } catch (e) {
          console.log(e)
        }
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
