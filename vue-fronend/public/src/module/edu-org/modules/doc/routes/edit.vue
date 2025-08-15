<template>

  <component
      v-model="visible"
      :loading="fetching"
      :title="title"
      dialogWidth="650px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >
    <template v-if="entityState" v-slot:default>

      <q-form ref="form">

        <div class="row q-col-gutter-md q-mb-lg">

          <div v-if="typeState" class="col-24 text-bold">
            {{ localType.title }}
          </div>

          <q-select
              v-if="!typeState"
              v-model="entityState.type"
              :options="localTypes"
              :rules="[val => !!val || 'Обязательное поле']"
              bg-color="white"
              class="col-24"
              emit-value
              label="Тип документа"
              map-options
              option-label="title"
              option-value="id"
              outlined
              @input="entityState.docCategoryId = null, entityState.docTypeId = null"
          />

        </div>

        <template v-if="localType">

          <div v-if="localType.epgu" class="row q-col-gutter-md q-mb-lg">

            <q-select
                v-if="docCategoryOptions.length > 1"
                v-model="entityState.docCategoryId"
                :options="docCategoryOptions"
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
                :option-label-full="(row)=>row.name + ' [' + row.id + ']'"
                option-label="name"
                :options="$store.getters['edu_doc/docTypesByCat'](entityState.docCategoryId)"
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

          <div v-if="localType.haveReq" class="row q-col-gutter-md q-mb-lg">

            <div class="col-24 col-sm-8">

              <q-input
                  v-model="entityState.docSeries"
                  bg-color="white"
                  label="Серия документа"
                  outlined
              />

            </div>

            <div class="col-24 col-sm-8">

              <q-input
                  v-model="entityState.docNumber"
                  :rules="[val => !!val || 'Обязательное поле']"
                  bg-color="white"
                  label="Номер документа"
                  outlined
              />

            </div>

            <div class="col-24 col-sm-8">

              <ui-input-date
                  v-model="entityState.issueDate"
                  :required="true"
                  bg-color="white"
                  label="Дата документа"
                  outlined
              />

            </div>

            <div class="col-24 ">

              <q-input
                  v-model="entityState.docOrg"
                  :rules="[val => !!val || 'Обязательное поле']"
                  bg-color="white"
                  label="Организация выдавшая документа"
                  outlined
              />

            </div>

            <div v-if="typeState==='passport'" class="col-24">
              <q-checkbox :value="!!entityState.fields.fioAnother" label="Другие ФИО" @input="onFioAnotherInput"/>
            </div>

            <template v-if="docTypeFields">

              <template
                  v-for="(field, index) of docTypeFields"
              >

                <div
                    v-if="excludeFields.indexOf(field.xml_name) === -1"
                    :key="index"
                    class="col-24"
                >

                  <component
                      :is="'edu-epgu-doc-field-' + field.type"
                      v-model="entityState.fields[field.xml_name]"
                      :cls="field.xml_cls"
                      :label="field.description"
                      :required="field.not_null"
                  />
                </div>
              </template>

            </template>

            <div
                v-if="['education','passport'].indexOf(typeState) === -1"
                class="col-24 col-sm-24"
            >

              <q-input v-model="entityState.docName" bg-color="white" label="Наименование документа" outlined/>

            </div>

          </div>

          <div v-if="actionState === 'create'" class="q-pa-md text-yellow-9 text-center"
               style="border: 1px solid #ddd;">
            Для загрзуки файлов сначала сохраните документ
          </div>

          <edu-doc-uploader
              v-else
              :required="false"
              :value="entityState.filesDocs"
              v-bind="relDocFields"
              @input="onFilesInput"
          />

        </template>


        <br/>
        <br/>

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
    closeOnSave: {},
    type: {},
    action: {default: 'edit'},
    isForeigner: {}
  },
  components: {},
  data() {
    return {
      entityIdState: this.entityId,
      typeState: this.type,
      dialogIs: 'ui-admin-dialog',
      dialog: {},
      updated: false
    }
  },
  computed: {
    excludeFields() {
      let res = []

      if (this.typeState === 'passport') {
        if (!this.entityState.fields.fioAnother) {
          res = [...res, ...[
            'Surname',
            'Name',
            'Patronymic'
          ]]
        }

        if (this.entityState.docTypeId === 100001 || this.entityState.docTypeId === 100039) {
          //res.push('IdOksm')
        }
      }

      return res
    },

    localTypes() {
      return this.$store.state.edu_doc.app.roles
    },

    localTypesById() {
      return this.localTypes.reduce((map, item) => {
        map[item.id] = item
        return map
      }, {})
    },

    localType() {
      return this.entityState && this.entityState.type ? this.localTypesById[this.entityState.type] : null
    },

    docCategoryOptions() {
      return this.$store.getters['edu_doc/docCategories'](this.localType.epguRootCats, this.localType.epguCats)
    },

    docType() {
      return this.$store.getters['edu_doc/docTypeById'][this.entityState.docTypeId]
    },

    docTypeFields() {
      if (this.docType) {
        const fieldsDesc = this.$util.base.deepGet(this.docType, 'fields.FieldsDescription')
        if (fieldsDesc) {
          const fieldsDescData = JSON.parse(fieldsDesc)
          if (fieldsDescData) {
            return fieldsDescData.fields
          }
        }
      }
    },

    title() {
      return this.actionState === 'create' ? 'Создать документ' : 'Редактировать документ ' + (this.entity ? this.entity.nid : '')
    },
    relDocFields() {
      return {
        docId: this.actionState === 'create' ? this.entityIdTemp : this.entityIdState,
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
    onBeforeHide() {
      if (this.updated) {
        this.onResolve && this.onResolve()
      }
    },
    onFilesInput(value) {
      this.entityState.files = value
      this.updated = true
    },

    onFioAnotherInput(v) {
      this.$set(this.entityState.fields, 'fioAnother', v)
    },
    async onSubmitCommit() {
      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('~module/edu-org/modules/order/gql/order/mutation/doc_update.gql'),
          variables: {
            id: this.entityIdState || this.entityIdTemp,
            action: this.actionState,
            model: this.entityForSave(this.entityState)
          }
        })

        if (res.result.success) {


          this.updated = false
          this.onResolve && this.onResolve(res.payload.entityId)

          if (this.closeOnSave) {
            this.visible = false
          } else {
            if (this.actionState === 'create') {
              this.entityIdState = res.payload.entityId
              this.actionState = 'edit'
              await this.fetch()
            }
          }
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
            query: require('~module/edu-org/modules/order/gql/order/query/doc.gql'),
            variables: {
              id: this.entityIdState
            },
            state: this.requestState,
          })

          this.typeState = entity.type
          this.orderIdState = entity.orderId
          this.assignEntity(entity)

        } catch (e) {
          console.log(e)
        }

      } else {

        let docTypeId, fields = {}

        if (this.typeState === 'passport') {
          if (this.isForeigner) {
            docTypeId = 100040
          } else {
            docTypeId = 100001
            fields.IdOksm = 185
          }
        }

        this.assignEntity({
          type: this.typeState,
          docCategoryId: null,
          docTypeId: docTypeId,
          fields: fields,
          docSeries: '1111',
          docNumber: '222333',
          issueDate: '23.03.1984',
          docOrg: 'AAAAA'
        })
      }
    },

  },
  watch: {
    'entityState.type': {
      immediate: true,
      handler(val, oldVal) {

        const role = this.localType

        if (role && this.entityState) {

          if (role.epgu) {

            if (role.epguCats && role.epguCats.length === 1) {
              this.entityState.docCategoryId = role.epguCats[0]
            }

          } else {
            this.entityState.docCategoryId = null
            this.entityState.docTypeId = null
          }

        }
      },
    },
  }

}

</script>

<style lang="scss" scoped>


</style>
