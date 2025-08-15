<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :loaded="fetched"
      title="Изменения согласия/отказа обработаны"
      @hide="onHide"
  >
    <template v-slot:default>
      <q-form ref="form">

        <div class="q-mb-md">
          № {{ entity.nid }} {{
            [
              entity.anket.personal.lastName,
              entity.anket.personal.firstName,
              entity.anket.personal.secondName
            ].join(' ')
          }}
        </div>

        <div class="text-weight-bold s-font-lg">
          Отметить изменение согласия или отказа, как обработанные?
        </div>

      </q-form>
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
      dialog: {
        mode: 'dialog'
      },

    }
  },
  computed: {
    personal() {
      return this.entity.anket.personal
    },
    actions() {
      return [
        {
          label: 'Подтвердить',
          callback: this.onSubmit
        }
      ]
    },

  },
  created() {
    this.fetch()
  },
  methods: {

    onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            let {data: {res: {result}}} = await this.$apollo.mutate({
              mutation: require('../gql/order/mutation/setAgreementChangedProcessed.gql'),
              variables: {
                _id: this.entity._id
              }
            })

            this.$bus.emit('processMessages', result.messages);

            if (result.success) {
              this.onResolve && this.onResolve()
              this.visible = false
            }

          } catch (e) {

            console.log(e)
          }

        }

      }).catch((e) => {

      })

    },
    async fetch() {
      await this.fetchingMethod(async () => {
        this.entity = this.entityData || await this.$store.dispatch('edu_order/entityQuerySingle', {id: this.entityId})
      })
    },

  },
  watch: {

  }

}

</script>

<style lang="scss" scoped>


</style>
