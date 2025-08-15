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
      ref="form"
      class="s-form-section-controls"
    >
      <div class="row q-col-gutter-sm">

        <div class="col-24">

          <q-select
            v-model="modelData.subject"
            :options="subjectsOptions"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Предмет"
            map-options
            option-label="name"
            option-value="id"
            outlined
          />

        </div>

        <div class="col-24">

          <q-select
            v-model="modelData.status"
            :options="[
                  {value: 'ready', label: 'экзамен сдан'},
                  {value: 'notready', label: 'собираюсь сдавать'},
                  {value: 'internal', label: 'собираюсь сдавать в ИРНИТУ'},

                ]"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Статус сдачи экзамена"
            map-options
            outlined
          />

        </div>

        <div class="col-24">

          <q-input
            v-if="modelData.status=='ready'"
            v-model="modelData.score"
            :rules="[val => !!val || 'Обязательное поле']"
            label="Количество баллов"
            outlined
          />

        </div>

        <div class="col-24">

          <q-select
            v-if="modelData.status=='ready'"
            v-model="modelData.year"
            :options="[
                  {value: 2023, label: 2023},
                  {value: 2022, label: 2022},
                  {value: 2021, label: 2021},
                  {value: 2020, label: 2020},
                  {value: 2019, label: 2019}
                ]"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Год сдачи"
            map-options
            outlined
          />

        </div>

      </div>
    </q-form>


  </ui-dialog>

</template>

<script>

import MVRoute from '@common/router/mixin/vroute'

export default {
  mixins: [MVRoute],
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

    pageTitle() {
      return 'Вступительное испытание'
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
              mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/subjectUpdate.gql'),
              variables: {
                model: this.modelData,
              },
            })

            this.onSaved(res.payload.subjects)
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
