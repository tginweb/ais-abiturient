<template>

  <component
      v-model="visible"
      :loaded="fetched"
      :loading="fetching"
      :title="'Файл ' + entityId"
      dialogWidth="650px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >
    <template v-slot:default>

      <q-form ref="form">

        <div class="row q-col-gutter-md">

          <q-select
              v-model="entityState.docCategoryId"
              :options="$store.getters['edu_order/epguDocCategories'](filterRoots)"
              :rules="[val => !!val || 'Обязательное поле']"
              bg-color="white"
              class="col-24"
              emit-value
              label="Категория документа"
              map-options
              option-disable="disable"
              option-label="name"
              option-value="id"
              outlined
              @input="entityState.docTypeId = null"
          >
            <template v-slot:option="scope">
              <q-item
                  :style="{
                marginLeft: scope.opt.parentId ? '30px !important' : '0px'
              }"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
              >
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

          </q-select>

          <q-select
              v-model="entityState.docTypeId"
              :option-label="(row)=>row.name + ' [' + row.id + ']'"
              :options="$store.getters['edu_order/epguDocTypesByCat'](entityState.docCategoryId)"
              :rules="[val => !!val || 'Обязательное поле']"
              bg-color="white"
              class="col-24"
              emit-value
              label="Тип документа"
              map-options
              option-value="id"
              outlined
          >
          </q-select>

        </div>

        <div v-if="entityState.docTypeId" class="row q-col-gutter-md q-pt-md">

          <div class="col-24 col-sm-8">

            <q-input v-model="entityState.fields.number" bg-color="white" label="Серия документа" outlined/>

          </div>

          <div class="col-24 col-sm-8">

            <q-input v-model="entityState.fields.serial" bg-color="white" label="Номер документа" outlined/>

          </div>


          <div class="col-24 col-sm-8">

            <q-input v-model="entityState.fields.date" bg-color="white" label="Дата документа" outlined/>

          </div>

          <div class="col-24 ">

            <q-input v-model="entityState.fields.org" bg-color="white" label="Организация выдавшая документа" outlined/>

          </div>

        </div>

        <edu-doc-uploader
            v-bind="{
              ...relDocFields
            }"
        />

      </q-form>
    </template>
  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    filterRoots: {},
    onResolve: {},
    orderId: {},
    action: {default: 'edit'}
  },
  components: {},
  data() {
    return {
      entityIdState: this.entityId,
      orderIdState: this.orderId
      dialogIs: 'ui-admin-dialog',
      dialog: {},
    }
  },
  computed: {
    relDocFields() {
      return {
        relDocType: 'doc',
        relDocId: this.actionState === 'create' ? this.entityIdTemp : this.entityIdState,
        temporary: this.actionState === 'create',
      }
    },
    actions() {
      return [
        {
          label: 'Сохранить',
          callback: this.onSubmit
        }
      ]
    },
  },
  created() {
    this.fetch()
  },
  methods: {

    async onSubmitCommit() {
      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/update.gql'),
          variables: {
            id: this.entityIdState || this.entityIdTemp,
            action: this.actionState,
            orderId: this.orderId,
            model: this.entityForSave(this.entityState)
          }
        })

        if (res.result.success) {
          if (this.actionState === 'create') {
            this.entityIdState = res.payload.entityId
            this.actionState = 'edit'
          }
          this.onResolve && this.onResolve()
        }

      } catch (e) {

        console.log(e)
      }

    },

    async onSubmit() {
      try {
        if (await this.$refs.form.validate())
          await this.onSubmitCommit()
      } catch (e) {
        console.log(e)
      }
    },

    entityForEdit(entity) {
      return {
        ...entity
      }
    },

    entityForSave(entity) {
      return {
        ...entity
      }
    },

    async fetch() {

      if (this.actionState !== 'create') {

        try {

          const entity = await this.$store.dispatch('gql/fetch', {
            mutation: require('../gql/order/mutation/docAdd.gql'),
            variables: {
              id: this.entityIdState,
            }
          })

          this.orderId = entity.orderId
          this.assignEntity(entity)

        } catch (e) {
          console.log(e)
        }

      } else {
        this.assignEntity({
          docCategoryId: null,
          docTypeId: null,
          fields: {}
        })
      }
    },

  },
  watch: {}

}

</script>

<style lang="scss" scoped>


</style>
