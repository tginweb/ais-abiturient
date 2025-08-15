<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :actions="actions"
      :actionsClose="true"
      :context="{entity}"
      :loaded="mState.fetched"
      title="Документ"
      dialogWidth="1250px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >

    <template v-slot:default="{entity}">


      <q-tab-panels v-model="modeId" animated class="">

        <q-tab-panel class="q-pa-none" name="view">

          <div class="row q-col-gutter-md">
            <div class="col-md-17">

              <div v-if="previewSrc" class="relative-position">

                <ui-admin-progress-inner-loading :value="!iframeLoaded"/>

                <iframe
                    :src="previewSrc"
                    style="width: 100%; height:700px;"
                    :style="{
                      height: (scrollHeight-20)+'px'
                    }"
                    @load="onIframeLoaded"
                />

              </div>


            </div>
            <div class="col-md-7">

              <ui-admin-data-card
                  title="Форма документа"
                  class="q-mb-md"
                  :fields="cardWordFields"
                  field-label-width="85px"
              >

                <ui-admin-file-uploader
                    accept="docx, doc"
                    rel-handler="workflow.document"
                    rel-field="FILE_WORD"
                    :rel-entity-id="entity.ID"
                    :value="entity.FILE_WORD_DATA"
                    class="q-mb-md"
                    :upload-btn-bind="{
                      class: 'full-width',
                      dense: true,
                    }"
                />

                <div class="q-gutter-y-sm">

                  <q-btn
                      icon="description"
                      label="Быстрый просмотр"
                      class="full-width"
                      @click="preview(entity.DOC_PDF_STREAM)"
                      outline
                  />

                  <q-btn
                      icon="description"
                      label="Скачать Word"
                      class="full-width"
                      :href="entity.DOC_WORD_DOWNLOAD"
                      dense
                      type="a"
                      target="_blank"
                      outline
                  />

                  <q-btn
                      icon="picture_as_pdf"
                      label="Скачать PDF"
                      class="full-width"
                      :href="entity.DOC_PDF_DOWNLOAD"
                      dense
                      type="a"
                      target="_blank"
                      outline
                  />

                </div>

              </ui-admin-data-card>

              <ui-admin-data-card
                  title="Подписанный клиентом"
                  class="q-mb-md"
                  field-label-width="85px"
              >
                <ui-admin-file-uploader
                    accept="pdf, png, jpg, jpeg"
                    rel-handler="workflow.document"
                    rel-field="FILE_SIGNED_CLIENT"
                    :rel-entity-id="entity.ID"
                    :value="entity.FILE_SIGNED_CLIENT_DATA"
                    :multiple="true"
                    :upload-btn-bind="{
                      class: 'full-width',
                      dense: true,
                    }"
                    class="q-mb-md"
                />

                <div class="q-gutter-y-sm" v-if="entity.SIGNED_CLIENT_STREAM">
                  <q-btn
                      icon="description"
                      label="Быстрый просмотр"
                      class="full-width"
                      dense
                      @click="preview(entity.SIGNED_CLIENT_STREAM)"
                      outline
                  />
                  <q-btn
                      icon="description"
                      label="Скачать"
                      class="full-width"
                      dense
                      :href="entity.SIGNED_CLIENT_DOWNLOAD"
                      type="a"
                      target="_blank"
                      outline
                  />
                </div>
              </ui-admin-data-card>

              <ui-admin-data-card
                  title="Подписанный"
                  class="q-mb-md"
                  field-label-width="85px"
              >
                <ui-admin-file-uploader
                    accept="pdf, png, jpg, jpeg"
                    rel-handler="workflow.document"
                    rel-field="FILE_SIGNED_BOTH"
                    :rel-entity-id="entity.ID"
                    :value="entity.FILE_SIGNED_BOTH_DATA"
                    :multiple="false"
                    :upload-btn-bind="{
                      class: 'full-width',
                      dense: true,
                    }"
                    class="q-mb-md"
                />

                <div class="q-gutter-y-sm" v-if="entity.SIGNED_BOTH_DOWNLOAD">
                  <q-btn
                      icon="description"
                      label="Быстрый просмотр"
                      class="full-width"
                      dense
                      @click="preview(entity.SIGNED_BOTH_STREAM)"
                      outline
                  />
                  <q-btn
                      icon="description"
                      label="Скачать"
                      class="full-width"
                      dense
                      :href="entity.SIGNED_BOTH_DOWNLOAD"
                      type="a"
                      target="_blank"
                      outline
                  />
                </div>
              </ui-admin-data-card>

            </div>
          </div>

        </q-tab-panel>

        <q-tab-panel class="q-pa-none" name="contracts">

        </q-tab-panel>

      </q-tab-panels>

    </template>


  </component>

</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    action: {default: 'edit'}
  },
  components: {},
  data() {
    return {
      termsEduLevels: [],
      modeId: 'view',
      previewSrc: null,
      iframeLoaded: false
    }
  },
  computed: {

    cardWordFields() {
      const fields = []

      if (this.entity.FILE_WORD_DATA) {
        fields.push({
          label: 'Способ:',
          value: this.entity.FILE_WORD_UPLOADED ? 'загружен вручную' : 'автоматически'
        })
      }

      return fields
    },

    modes() {
      return [
        {
          id: 'view',
          label: 'Просмотр',
          type: 'tab',
          actions: () => {

          }
        },
      ]
    },

    actions() {

      const actions = []

      if (this.modeId === 'edit') {
        actions.push({
          label: 'Сохранить',
          color: 'primary',
          callback: this.onSubmit
        })
      }

      return actions
    },

  },
  async created() {
    await this.fetch()

    this.preview(this.entity.DOC_PDF_STREAM)
  },
  methods: {

    onIframeLoaded() {
       this.iframeLoaded = true
    },

    preview(url) {
      this.previewSrc = url
    },

    async onSubmitCommit() {

      const entity = this.entityForSave(this.entityState)

      try {

        await this.mutationMethod(
            async () => {
              return await this.$apollo.mutate({
                mutation: require('../gql/mutation/single.gql'),
                variables: {
                  id: parseInt(this.entityId),
                  action: this.action,
                  model: entity,
                }
              })
            },
            async () => {
              if (this.onResolve)
                this.onResolve()
              this.visible = false
            }
        )

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

    async fetch(refetch) {

      if (this.actionState !== 'create') {

        try {
          await this.fetchingMethod(
              async () => {
                return await this.$apollo.query({
                  query: require('../gql/query/single.gql'),
                  fetchPolicy: 'no-cache',
                  variables: {
                    id: this.entityIdState
                  }
                })
              },
              ({res}) => {
                this.assignEntity(res)
              }
          )
        } catch (e) {

          console.log(e)
        }

      } else {
        this.assignEntity({
          NAME: null
        })
      }
    },

  },
  watch: {
    previewSrc() {
      this.iframeLoaded = false
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
