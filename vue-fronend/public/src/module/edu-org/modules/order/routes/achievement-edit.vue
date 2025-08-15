<template>

  <ui-dialog
      v-model="visible"
      :actions="actions"
      :loading="fetching"
      :title="pageTitle"
      dialogWidth="650px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >

    <q-form
        ref="form"
        class="s-form-section-controls"
    >
      <div class="row q-col-gutter-md">

        <div class="col-24">


          <q-select
              v-model="modelData.typeId"
              :options="achievementOptions"
              :rules="[val => !!val || 'Обязательное поле']"
              emit-value
              label="Категория достижения"
              map-options
              option-label="name"
              option-value="id"
              outlined
              @input="modelData.docId = null"
          >
            <template v-slot:selected-item="scope">

              <div v-if="scope.opt.content" v-html="scope.opt.content"></div>
              <div v-else>{{ scope.opt.name }}</div>

            </template>

            <template v-slot:option="scope">
              <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
              >
                <q-item-section>
                  <q-item-label v-if="scope.opt.content" v-html="scope.opt.content"/>
                  <q-item-label v-else v-html="scope.opt.name"/>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

        </div>

        <div v-if="modelData.typeId" class="col-24">

          <q-select
              v-model="modelData.docId"
              :options="docOptions"
              :rules="[val => !!val || 'Необходимо выбрать документ или создать новый по кнопке Добавить']"
              reactive-rules
              emit-value
              label="Документ подтверждающий достижение"
              map-options
              option-label="docTypeName"
              option-value="id"
              outlined
          >
            <template v-slot:append>
              <q-btn
                  class="full-width"
                  color="primary"
                  label="Добавить"
                  @click="onAddDoc"
              />

            </template>
          </q-select>
        </div>

        <div class="col-24">


        </div>

      </div>


    </q-form>

  </ui-dialog>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

const cloneDeep = require('clone-deep');

export default {
  mixins: [MVroute],
  components: {},
  props: {
    order: {},
    model: {},
    items: {},
    onSaved: {},
    closeOnSave: {},
    action: {default: 'edit'}
  },
  data() {
    return {
      entityIdState: this.entityId,
      modelData: {
        typeId: null,
        docId: null,
        ...this.$util.base.cloneDeep(this.model || {}),
      },
      proc: false,
      status: ''
    }
  },
  computed: {
    achievementType() {
      return this.achievementOptions.find(item => item.id === this.modelData.typeId)
    },

    docOptions() {
      return this.order.docs.filter(doc => doc.roleInfo.achievements && doc.type === this.achievementType.docRole)
    },

    achievementOptions() {
      return this.$store.getters['edu_achievement/itemsByUserOrder']
    },
    pageTitle() {
      return 'Достижение'
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
    docRules() {

    }
  },
  methods: {
    async onDocSave(docId) {
      await this.$store.dispatch('edu_order/userOrderFetchDocs')
      setTimeout(() => {
        this.$set(this.modelData, 'docId', docId)
        console.log(docId, 'sss')
      }, 300)
    },

    onAddDoc() {

      this.$router.push({
        name: 'edu.doc:create',
        params: {
          type: this.achievementType.docRole,
          onResolve: this.onDocSave,
          closeOnSave: true
        },
        query: {
          orderId: this.order._id
        }
      })

    },

    async onSave() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            let {data: {res}} = await this.$apollo.mutate({
              mutation: require('~module/edu-org/modules/order/gql/order/mutation/achievement_update.gql'),
              variables: {
                id: this.entityIdState,
                action: this.actionState,
                model: this.modelData
              },
            })

            if (res.result.success) {
              if (this.actionState === 'create') {
                this.entityIdState = res.payload.entityId
                this.actionState = 'edit'
              }
              this.onResolve && this.onResolve(res.payload.entityId)
              if (this.closeOnSave) {
                this.visible = false
              }
            }

          } catch (e) {
            console.log(e)
          }
        }
      }).catch((e) => {
        console.log(e)
      })

    },
  },
  watch: {

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
