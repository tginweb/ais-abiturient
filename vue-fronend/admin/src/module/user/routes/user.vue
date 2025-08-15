<template>

  <component
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :scroll-height.sync="scrollHeight"
      :tab.sync="modeId"
      :tabs="modesTabs"
      :title="'Пользователь ' + entityId"
      dialog-width="1350px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >

    <template v-slot:default="{entity}">

      <div class="q-gutter-x-md flex q-mb-lg q-mt-sm">

        <q-toggle v-model="editState" label="Редактировать"/>

        <q-space/>

        <q-btn
            v-if="changed"
            color="primary"
            icon="fas fa-plus"
            label="Сохранить изменения"
            size="md"
            @click="onSave"
        />

        <q-btn
            v-if="changed"
            color="red"
            icon="fas fa-trash"
            label="Сбросить изменения"
            outline
            size="md"
            @click="onReset"
        />

      </div>


      <q-tab-panels v-model="modeId" animated>

        <q-tab-panel class="q-px-none" name="common">

          <div class="row q-col-gutter-md">

            <div class="col-12 q-gutter-lg">

              <ui-admin-data-card
                  :fields="sectionCommonFields"
              />

              <ui-admin-data-card
                  title="Инфо"
              >
                <div class="row q-col-gutter-md">
                  <q-input
                      v-model="entityState.lastName"
                      :readonly="readonly"
                      class="col-24"
                      label="Фамилия"
                      outlined
                      @input="changed = true"
                  />
                  <q-input
                      v-model="entityState.firstName"
                      :readonly="readonly"
                      class="col-24"
                      label="Имя"
                      outlined
                      @input="changed = true"
                  />
                  <q-input
                      v-model="entityState.secondName"
                      :readonly="readonly"
                      class="col-24"
                      label="Отчество"
                      outlined
                      @input="changed = true"
                  />
                </div>
              </ui-admin-data-card>

              <ui-admin-data-card
                  title="Роли"
              >
                <q-select
                    v-model="entityState.roles"
                    :options="rolesOptions"
                    :readonly="readonly"
                    class=""
                    emit-value
                    label="Роли"
                    map-options
                    multiple
                    option-label="name"
                    option-value="id"
                    use-chips
                    @input="changed = true"
                />
              </ui-admin-data-card>

            </div>

            <div class="col-12 q-gutter-lg">


            </div>

          </div>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="orders">


        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="paycards">


        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="profiles">


        </q-tab-panel>

      </q-tab-panels>

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
  components: {},
  data() {
    return {
      modeId: 'common',
      entityIdState: this.entityId,
      editState: false
    }
  },
  computed: {
    rolesOptions() {
      return this.$store.state.user_admin.app.roles
    },
    readonly() {
      return !this.editState
    },
    modes() {
      return [
        {
          id: 'common',
          label: 'Общее',
          type: 'tab',
        },
        {
          id: 'orders',
          label: 'Заказы',
          type: 'tab',
        },
        {
          id: 'paycards',
          label: 'Карты',
          type: 'tab',
        },
        {
          id: 'profiles',
          label: 'Профили',
          type: 'tab',
        },
      ]
    },

    sectionCommonFields() {

      const result = [
        {label: 'ID', value: this.entity._id},
        {label: 'Логин', value: this.entity.login},
        {label: 'E-mail', value: this.entity.email},
      ]

      return result
    },

  },
  created() {
    this.fetch()
  },

  methods: {
    onReset() {
      this.unsetChanged()
      this.entityState = this.entityForEdit(this.entity)
    },
    unsetChanged() {
      this.changed = false
    },
    async onSaveCommit() {

      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/save.gql'),
          variables: {
            id: this.entity._id,
            action: this.actionState,
            model: this.entityForSave(this.entityState)
          }
        })
        if (res.result.success) {
          this.unsetChanged()
          this.$emit('saved')
        }
      } catch (e) {
        console.log(e)
      }

    },
    onSave() {
      this.onSaveCommit()
    },
    async fetch() {
      try {
        const entity = await this.$store.dispatch('user_admin/userFetch', {
          id: this.entityIdState,
          options: {
            state: this.requestState,
            setFetched: false
          }
        })
        this.assignEntity(entity, this.requestState)
      } catch (e) {
        console.log(e)
      }
    },

  },
  watch: {
    'entity.ID'(id) {
      this.orders.filter.USER_ID = {eq: id}
      this.paycards.filter.USER_ID = {eq: id}
      this.profiles.filter.USER_ID = {eq: id}
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
