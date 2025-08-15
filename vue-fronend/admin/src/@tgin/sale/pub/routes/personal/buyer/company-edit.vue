<template>

  <component
      v-bind="bindRouterWrapper"
      :path="pagePathFull"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :title="pageTitle"
      dialog-width="660px"
      @hide="onHide"
  >

    <template v-slot:default>

      <q-form ref="form" class="q-pb-lg">

        <div class="row q-col-gutter-md q-col-gutter-xl-md q-mb-lg ">

          <ui-input-inn
              label="ИНН"
              v-model="entityState.VALUES.INN"
              class="col-12 col-md-24"
              :rules="[
                val => !!val || 'Обязательное поле'
              ]"
              @change="onInnChange"
          />

          <template v-if="!!entityId || entityState.VALUES.INN">

            <q-input
                label="Наименование юр. лица"
                v-model="entityState.NAME"
                class="col-12 col-md-24"
                :rules="[
                val => !!val || 'Обязательное поле'
              ]"
            />

            <q-input
                label="КПП"
                v-model="entityState.VALUES.KPP"
                class="col-12 col-md-12"
                :rules="[
                val => !!val || 'Обязательное поле'
              ]"
            />

            <q-input
                label="ОГРН"
                v-model="entityState.VALUES.OGRN"
                class="col-12 col-md-12"
                :rules="[
                val => !!val || 'Обязательное поле'
              ]"
            />

            <q-input
                label="Юридический адрес"
                v-model="entityState.VALUES.ADDRESS_JUR"
                class="col-24"
                :rules="[
                val => !!val || 'Обязательное поле'
              ]"
            />

            <q-input
                label="Почтовый адрес"
                v-model="entityState.VALUES.ADDRESS_MAIL"
                class="col-24"
            />

            <q-input
                label="Фактический адрес"
                v-model="entityState.VALUES.ADDRESS"
                class="col-24"
            />

            <q-input
                label="В лице"
                v-model="entityState.VALUES.INFACE"
                hint="для договора"
                class="col-24"
            />

          </template>

        </div>

      </q-form>


    </template>

  </component>

</template>

<script>

import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MRoute, MVRoute],
  components: {},
  props: {
    item: {},
    id: {},
    action: {default: 'edit'},
    onSaved: {},
    context: {},
    canDelete: {default: true}
  },
  data() {
    return {}
  },
  computed: {
    pageTitle() {
      if (this.action === 'create') {
        return 'Новая компания'
      } else {
        return this.entity && this.entity.NAME
      }
    },
    actions() {
      const result = [];

      if (this.action === 'edit') {

        result.push({
          label: 'Сохранить',
          color: 'primary',
          textColor: 'white',
          width: this.canDelete ? 'col-16' : 'col-24',
          callback: () => {
            setTimeout(() => {
              this.onSave()
            }, 300)
          }
        })

        if (this.canDelete) {
          result.push({
            label: 'Удалить',
            color: 'primary',
            outline: true,
            width: 'col-8',
            callback: () => {
              this.onDelete()
            }
          })
        }

      } else {

        result.push({
          label: 'Сохранить',
          color: 'primary',
          textColor: 'white',
          width: 'col-24',
          callback: () => {
            setTimeout(() => {
              this.onSave()
            }, 300)
          }
        })
      }

      return result
    },
  },
  methods: {
    onInnChange(info) {
      this.entityState.NAME = info.companyName

      if (info.data.address) {
        this.entityState.VALUES.ADDRESS_JUR = info.data.address.value
        this.entityState.VALUES.ADDRESS_MAIL = info.data.address.value
        this.entityState.VALUES.ADDRESS = info.data.address.value
      }

      this.entityState.VALUES.KPP = info.data.kpp
      this.entityState.VALUES.OGRN = info.data.ogrn
      this.entityState.VALUES.OKPO = info.data.okpo
    },

    async onSaveCommit() {
      try {
        const entity = this.entityForSave(this.entityState)
        await this.$store.dispatch('gql/mutation', {
          mutation: require('../../../gql/buyer/mutation/company_save.gql'),
          variables: {
            id: this.entityIdState,
            name: entity.NAME,
            props: entity.VALUES,
          },
          state: this.requestState,
        })
        this.onResolve && this.onResolve()
        this.visible = false
      } catch (e) {
        console.log(e)
      }
    },
    async onSave() {
      try {
        if (await this.$refs.form.validate())
          await this.onSaveCommit()
      } catch (e) {
        console.log(e)
      }
    },
    async onDelete() {
      try {
        await this.$store.dispatch('sale_pub/deleteUserBuyerCompany', {id: this.entityIdState})
        this.onResolve && this.onResolve()
        this.visible = false
      } catch (e) {

      }
    },
    async fetch() {
      if (this.action === 'create') {
        this.assignEntity({
          NAME: null,
        }, this.requestState)
      } else {
        try {
          let entity = await this.$store.dispatch('sale_pub/userBuyerCompanyFetch', {
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
      }
    },
    entityForEdit(entity) {
      return {
        ...entity,
        VALUES: entity.PROPS && entity.PROPS.reduce((map, obj) => (map[obj.CODE] = obj.VAL, map), {}) || {}
      }
    },
    onSavedEvent(action, profile) {
      if (this.onSaved) {
        this.onSaved(action, profile)
      }
      this.visible = false
    }
  },
  async created() {
    await this.fetch();
  }
}
</script>
<style lang="scss" scoped>


</style>
