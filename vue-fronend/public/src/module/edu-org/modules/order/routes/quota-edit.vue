<template>

  <ui-dialog
      v-model="visible"
      :actions="actions"
      :loading="fetching"
      :title="pageTitle"
      v-bind="bindRouterWrapper"
      @hide="onHide"
      dialog-width="550px"
  >

    <q-form
        ref="form"
        class="s-form-section-controls"
    >
      <div class="row q-col-gutter-sm">

        <div class="col-24">

          <q-select
              v-model="modelData.quotaType"
              :options="typeOptions"
              :rules="[val => !!val || 'Обязательное поле']"
              emit-value
              label="Вид льготы"
              map-options
              option-label="name"
              option-value="id"
              outlined
          />

          <div class="col-24">

            <q-checkbox v-model="modelData.haveDoc" label="Есть документ"></q-checkbox>

          </div>

        </div>

        <div v-if="modelData.haveDoc" class="row q-col-gutter-sm">

          <div class="col-24 col-sm-8">

            <q-input v-model="modelData.doc.number" label="Номер документа" outlined>
            </q-input>

          </div>

          <div class="col-24 col-sm-8">

            <q-input v-model="modelData.doc.serial" label="Серия документа" outlined>
            </q-input>

          </div>

          <div class="col-24 col-sm-8">

            <q-input v-model="modelData.doc.date" label="Дата документа" outlined>
            </q-input>

          </div>

          <div class="col-24 ">

            <q-input v-model="modelData.doc.organization" label="Организация выдавшая документа" outlined>
            </q-input>

          </div>

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
    action: {default: 'edit'},
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
              mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/quotaUpdate.gql'),
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
