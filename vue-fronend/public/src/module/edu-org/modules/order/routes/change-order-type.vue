<template>

  <ui-dialog
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :loading="fetching"
    title="Сменить уровень образования заявления"
    @hide="onHide"
  >

    <q-form ref="form">

      <q-banner class="q-mb-lg bg-red-8 text-white">
        Внимание! При смене уровня образования часть заполненных данных будет утеряна
      </q-banner>

      <div class="row q-col-gutter-sm">

        <div class="col-24">

          <q-select
            v-model="orderType"
            :options="[
              {id: 1, name: 'Среднее профессиональное образование'},
              {id: 2, name: 'Бакалавриат и специалитет'},
              {id: 3, name: 'Магистратура'},
              {id: 4, name: 'Аспирантура'},
            ]"
            :rules="[val => !!val || 'Required field']"
            emit-value
            label="Тип заявления"
            map-options
            option-label="name"
            option-value="id"
            outlined
          />

        </div>

      </div>

    </q-form>

  </ui-dialog>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  components: {},
  props: {
    model: {},
    onSaved: {}
  },
  data() {
    return {
      proc: false,
      orderType: this.$store.getters['edu_order/userOrder'].eduType
    }
  },
  computed: {
    order() {
      return this.$store.getters['edu_order/userOrder']
    },

    actions() {
      return [
        {
          label: 'Сменить уровень',
          color: 'primary',
          disable: !this.orderType || this.orderType === this.$store.getters['edu_order/userOrder'].eduType,
          callback: this.onSave
        },
      ]
    },
  },
  methods: {

    async onSave() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            let {data: {res}} = await this.$apollo.mutate({
              mutation: require('../gql/order/mutation/change_type.gql'),
              variables: {
                orderType: this.orderType,
              },
            })

            this.$bus.emit('processMessages', res.result.messages)

            if (res.result.success) {
              this.visible = false
              window.location.replace('/cab/order/view')
            }

          } catch (e) {

            console.log(e)

          }
        }
      }).catch((e) => {
        console.log(e)
      })

    },
  }
}
</script>
<style lang="scss" scoped>


</style>
