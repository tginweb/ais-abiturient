<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :loaded="fetched"
      :title="'Заявление ' + entityId"
      @hide="onHide"
  >
    <template v-slot:default>
      <q-form ref="form">

        <div class="q-mb-md text-weight-bold">
          № {{ entity.nid }} {{
            [
              entity.anket.personal.lastName,
              entity.anket.personal.firstName,
              entity.anket.personal.secondName
            ].join(' ')
          }}
        </div>

        <div class="flex q-mb-md q-gutter-x-md">
          <div>Текущий статус:</div>
          <div>{{ entity.state.statusInfo.titleAdmin }}</div>
        </div>

        <q-select
            v-model="model.status"
            :options="$store.getters['edu_order/statusOptions']"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Новый статус"
            map-options
            option-label="titleAdmin"
            option-value="code"
            outlined
        />

        <q-checkbox
            v-model="model.notify"
            class="q-my-md"
            label="Отправить сообщение абитуриенту о смене статуса заявления (на email и в чат)"
        />

        <q-input
            v-if="model.notify"
            v-model="model.message"
            class="q-mb-xl"
            label="Дополнительный комментарий"
            hint="Будет прикерплен к сообщению о смене статуса. Например, здесь можно указать ошибки в заявлении при установке статусов корректировки"
            rows="3"
            outlined
            type="textarea"
        />

        <template v-if="model.status==='accepted'">

          <q-checkbox v-model="model.setInstitute" class="q-mb-sm" label="Передать на факультет"/>

          <ul v-if="model.setInstitute" class="q-my-none">
            <li>
              <div>
                Заявление будет передано на факультет:
              </div>
              <div class="text-weight-bold">
                {{
                  $store.getters['edu_institute/byId'][entity.cfacComputed] && $store.getters['edu_institute/byId'][entity.cfacComputed].name
                }}
              </div>
            </li>
          </ul>

        </template>

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
      model: {
        status: null,
        notify: true,
        message: '',
        setInstitute: false
      }
    }
  },
  computed: {
    personal() {
      return this.entity.anket.personal
    },
    actions() {
      return [
        {
          label: 'Сменить статус',
          callback: this.onSubmit
        }
      ]
    },

    firstApp() {
      return this.model.applications.items[0]
    }

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
              mutation: require('../gql/order/mutation/setStatus.gql'),
              variables: {
                _id: this.entity._id,
                ...this.model
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

        this.model.status = this.entity.state.status
      })
    },

  },
  watch: {
    'model.status'(val) {
      if (val === 'accepted') {
        this.model.setInstitute = true
      } else {
        this.model.setInstitute = false
      }
    }
  }

}

</script>

<style lang="scss" scoped>


</style>
