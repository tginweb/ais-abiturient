<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :loaded="fetched"
      :title="'Передать заявление ' + entityNid"
      dialog-width="570px"
      @hide="onHide"
  >
    <template v-slot:default>

      <q-form ref="form" v-if="entity">

        <div class="q-mb-md text-weight-bold">
          № {{ entity.nid }} {{ entity.fio }}
        </div>

        <div class="row q-col-gutter-md q-mb-md no-wrap">
          <div class="col-10">Текущий факультет:</div>
          <div>{{ entity.institute ? entity.institute.name : 'нет' }}</div>
        </div>

        <div class="row q-col-gutter-md no-wrap">
          <div class="col-10">
            Будет передано на факультет:
          </div>
          <div class="text-weight-bold">
            {{ entity.firstApp && entity.firstApp.fac ? entity.firstApp.fac.name : 'нет' }}
          </div>
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
      entityIdState: this.entityId,
      dialogIs: 'ui-admin-dialog',
      dialog: {
        mode: 'dialog'
      },
      model: {

      }
    }
  },
  computed: {
    entityNid() {
      return this.entity ? this.entity.nid : null
    },
    actions() {
      return [
        {
          label: 'Передать',
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
            const res = await this.$store.dispatch('gql/mutation', {
              mutation: require('../gql/order/mutation/set_fac_first.gql'),
              variables: {
                id: this.entityId,
              }
            })

            if (res.result.success) {
              console.log(res.payload)
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
        this.entity = this.entityData || await this.$store.dispatch('edu_order/entityQuerySingle', this.entityId)
      })
    },

  },
  watch: {
  }
}

</script>

<style lang="scss" scoped>


</style>
