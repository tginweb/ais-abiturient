<template>

  <ui-dialog
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :loading="fetching"
    :title="pageTitle"
    @hide="onHide"
  >

    <q-form
      class="s-form-section-controls"
      ref="form"
    >
      <div class="row q-col-gutter-sm">

        <div class="col-24">

          <q-select
            :options="$store.getters['edu_familyType/items']"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Степень родства"
            map-options
            option-label="name"
            option-value="id"
            outlined
            v-model="modelData.familyType"
          />

        </div>

        <div class="col-24">

          <q-input
            :rules="[val => !!val || 'Обязательное поле']"
            label="ФИО"
            outlined
            v-model="modelData.fio"
          />

        </div>

        <div class="col-12">

          <q-input
            :rules="[
                  val => !!val || 'Обязательное поле'
                ]"
            label="Телефон"
            mask="+# (###) ### - ######"
            outlined
            unmasked-value
            lazy-rules
            v-model="modelData.phone"
          />

        </div>

        <div class="col-12">

          <q-input
            label="E-mail"
            outlined
            v-model="modelData.email"
          />

        </div>

        <div class="col-24">

          <q-input
            :rules="[val => !!val || 'Обязательное поле']"
            label="Место жительства"
            outlined
            v-model="modelData.address"
          />

        </div>

        <div class="col-24">

          <q-input
            label="Кем и где работает"
            outlined
            v-model="modelData.work"
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
    items: {},
    onSaved: {}
  },
  data() {
    return {
      modelData: this.$util.base.cloneDeep(this.model),
      proc: false,
      status: ''
    }
  },
  computed: {

    typeOptions() {
      return this.$store.getters['edu_quotaType/items'].filter(
        (term) => this.modelData.quotaType === term.id || !this.items.find((item) => item.quotaType === term.id)
      )
    },

    pageTitle() {
      return 'Льгота'
    },
    actions() {
      return [
        {
          label: 'Сохранить',
          color: 'primary',
          callback: this.onSave
        },
      ]
    },

    subjectsOptions() {

      return this.$store.getters['edu_subject/egeItemsOptions'].filter(
        (term) =>
          this.modelData.subject === term.id || !this.items.find((item) => item.subject === term.id)
      )
    }
  },
  methods: {
    async onSave() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            let {data: {res}} = await this.$apollo.mutate({
              mutation: require('../gql/order/mutation/family_update.gql'),
              variables: {
                model: this.modelData,
              },
            })

            this.onSaved(res.payload.quotes)
            this.$bus.emit('processMessages', res.result.messages)
            this.visible = false

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

.c-orders {
  border: 1px solid #EFEEEE;

  .c-orders__order:not(:last-child) {
    border-bottom: 1px solid #EFEEEE;
  }
}

</style>
