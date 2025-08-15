<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :title="'Установка статусов заявления ' + entityId"
      @hide="onHide"
  >

    <q-form ref="form">

      <div class="q-mb-md text-weight-bold">
        Новый статус заявлений
      </div>

      <q-select
        v-model="model.status"
        :options="$store.getters['edu_order/appStatusOptions'].filter(item => !!item.selectable)"
        :rules="[val => !!val || 'Обязательное поле']"
        emit-value
        label="Новый статус"
        map-options
        option-label="name"
        option-value="id"
        outlined
      />

      <q-input
        v-if="model.notify"
        v-model="model.message"
        class="q-mt-md"
        label="Дополнительный комментарий"
        hint="Будет прикерплен к сообщению о смене статуса в ЕПГУ"
        rows="3"
        outlined
        type="textarea"
      />

      <div class="q-mt-xl q-mb-md text-weight-bold">
        Статусы будут установлены для следующих заявлений
      </div>

      <q-markup-table
        v-if="apps.length>0"
        class="c-applications s-table-data"
        flat
      >
        <thead>
        <tr>
          <th>#</th>
          <th style="width: 60%">Направление</th>
          <th>Статус в ЛК</th>
        </tr>
        </thead>
        <tbody>

        <tr
          v-for="(item, index) in apps"
          class="__item"
        >

          <td class="dense">
            {{ item.priority }}
          </td>

          <td class="">

            <div v-if="item.admission">

              {{ item.admission.abbr }}

            </div>

            <div v-if="item.source" class="text-grey-8">
              {{ item.source.name }}
            </div>

          </td>


          <td class="">

            <div v-if="item.status" class="text-weight-bold">
              {{ item.status.name }}
            </div>

          </td>


        </tr>

        </tbody>

      </q-markup-table>


    </q-form>


  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import * as sections from '@project/components/entity/order/section'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'},
    apps: {}
  },
  components: {
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
              mutation: require('../gql/order/mutation/appsAction.gql'),
              variables: {
                _id: this.entity._id,
                appsIds: this.apps.map(item => item._id),
                action: 'setStatus',
                data: this.model
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
