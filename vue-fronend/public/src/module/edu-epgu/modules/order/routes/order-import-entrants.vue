<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    title="Импорт из ЕПГУ"
    dialogWidth="550px"
    @hide="onHide"

  >

    <q-form ref="form">

      <q-input
        v-model="model.snils"
        label="Snils"
        outlined
        rows="5"
        type="textarea"
      />

    </q-form>

  </component>

</template>

<script>

import MVroute from '@common/router/mixin/vroute'
import CDataList from '~module/cab/component/ui/data-list'
import * as sections from '@project/components/entity/order/section'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {
    CDataList,
    ...sections
  },
  data() {
    return {
      tab: 'common',
      tabEntities: 'source',
      dialogIs: 'ui-admin-dialog',
      dialog: {
        mode: 'dialog'
      },
      model: {
        snils: `
77777777777
15738530589
19558310605
07168941290
18849786666
        `.trim()
      }
    }
  },
  computed: {

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

  },
  methods: {

    onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            let {data: {res: {result}}} = await this.$apollo.mutate({
              mutation: require('../gql/mutation/importEntrants.gql'),
              variables: {
                snils: this.model.snils.split(/\n/)
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


  },
  watch: {

  }

}

</script>

<style lang="scss" scoped>


</style>
