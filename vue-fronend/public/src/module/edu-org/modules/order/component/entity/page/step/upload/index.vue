<template>

  <div class="">

    <div class="q-gutter-x-md flex q-pb-lg">

      <q-btn
          v-if="false"
          color="primary"
          icon="fas fa-plus"
          label="добавить предмет"
          outline
          size="md"
          @click="onAdd()"
      />

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

    <q-form ref="form">

      <template v-for="role in docRoles">

        <div class="c-section q-mb-xl q-pb-md bg-white">

          <div class="q-px-lg q-py-sm" style="background-color: #efefef;">
              <span class="s-font-lg text-bold ">
                {{ role.title }}
              </span>
          </div>

          <div class="q-px-lg">

            <q-markup-table
                class="c-applications s-table  body-no-padding-hor"
                flat
            >
              <tbody>

              <template v-if="docsGrouped[role.id]">

                <tr
                    v-for="(item, index) in docsGrouped[role.id]"
                    class="__item"
                >

                  <td
                      class=""
                      style="cursor: pointer;"
                      width="38%"
                      @click="onOpen(item)"
                  >
                    <span class="cursor-pointer s-font-lg s-link">{{ item.docTypeName }}</span>
                  </td>

                  <td>
                    <q-btn
                        v-if="item.printComponent"
                        class="q-ml-auto"
                        color="secondary"
                        icon="print"
                        label="распечатать"
                        no-wrap
                        outline
                        size="14px"
                        @click="onPrint(item.printComponent)"
                    />
                  </td>
                  <td
                      class=""
                      width="28%"
                  >
                    <edu-doc-uploader
                        :required="role.required && item.createSource==='cis_abit'"
                        :value="item.filesDocs"
                        v-bind="{
                          ...getUploaderFields(item)
                        }"
                        @input="item.files = $event"
                    />
                  </td>

                  <td
                      width="10%"
                  >
                    <div v-if="item.createSourceInfo && item.createSource !== 'cis_abit'">
                      <div class="s-font-xs text-grey">Способ создания:</div>
                      {{ item.createSourceInfo.title }}
                    </div>
                  </td>
                  <td
                      class=""
                      width="10%"
                  >
                    {{ item.statusId }}
                  </td>
                  <td
                      width="4%"
                  >
                    <q-btn
                        v-if="item.canDeleteAbit"
                        color="red"
                        dense
                        icon="delete"
                        outline
                        @click="onDelete(item)"
                    />
                  </td>
                </tr>
              </template>

              </tbody>

            </q-markup-table>
          </div>

          <div v-if="role.multiple || !docsGrouped[role.id]" class="q-px-lg q-pt-md">
            <q-btn
                v-if="role.multiple || !docsGrouped[role.id]"
                :label="'Добавить документ'"
                class="q-px-sm"
                color="primary"
                dense
                icon="add"
                outline
                size="14px"
                @click="onAdd(role.id)"
            />
          </div>

        </div>

      </template>

    </q-form>

    <q-btn
        color="primary"
        icon-right="fas fa-arrow-right"
        label="Перейти к отправке заявления"
        rounded
        size="lg"
        @click="onNext"
    />

    <el-print-template ref="print">
      <component :is="printIs" v-slot="scope" :vars="{order: order}"></component>
    </el-print-template>


  </div>

</template>

<script>

import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep";

export default {
  components: {
    'tpl-print-consent': () => import('@project/components/templates/print/consent'),
    'tpl-print-consent-dist': () => import('@project/components/templates/print/consent-dist'),
    'tpl-print-app-bak': () => import('@project/components/entity/order/templates/print/bak-order'),
    'tpl-print-app-mag': () => import('@project/components/entity/order/templates/print/mag-order'),
    'tpl-print-app-spo': () => import('@project/components/entity/order/templates/print/spo-order'),
    'tpl-print-app-asp': () => import('@project/components/entity/order/templates/print/asp-order'),
  },
  props: {
    order: {}
  },
  data() {
    return {
      popupResolved: false,
      itemsState: cloneDeep(this.order.docs),
      changed: false,
      upload: {
        accept: '.pdf, .png, .jpg, .jpeg',
        maxSize: '10000000'
      },
      printIs: null
    }
  },
  computed: {
    storeOrder() {
      return this.$store.getters['edu_order/userOrder']
    },
    docRoles() {
      return this.order.docsRoles.filter(item => !item.parent)
    },
    docsGrouped() {
      return this.itemsState.reduce((map, doc) => {

        if (['app', 'consent', 'consent_dist', 'photo'].indexOf(doc.type) > -1) {
          map.packet.push(doc)
        } else {
          if (!map[doc.type]) {
            map[doc.type] = []
          }
          map[doc.type].push(doc)
        }

        return map
      }, {
        packet: []
      })
    }

  },
  methods: {
    async refetchDocs() {
      await this.$store.dispatch('edu_order/userOrderFetchDocs')
    },
    onPrint(com) {

      this.printIs = com

      setTimeout(() => {
        this.$refs.print.print();
      }, 300)
    },

    async onSaveCommit() {

    },

    async onNext() {
      if (await this.$refs.form.validate()) {
        await this.onSaveCommit()
        console.log('ddd')
      } else {
        const errorElm = this.$refs.form.$el.querySelector('.q-field--error')
        if (errorElm) {
          this.$util.dom.scrollTo({el: errorElm, offset: 80, duration: true})
          return;
        }
      }
    },
    getUploaderFields(doc) {
      return {
        docId: doc.id,
      }
    },
    async onDeleteCommit(item) {
      const res = await this.$store.dispatch('gql/mutation', {
        mutation: require('~module/edu-org/modules/order/gql/order/mutation/doc_delete.gql'),
        variables: {
          id: item.id,
        }
      })
      if (res.result.success) {
        await this.refetchDocs()
      }
    },
    onDelete(item) {
      this.$q.dialog({
        title: 'Подтвердите удаление',
        cancel: true,
      }).onOk(() => {
        this.onDeleteCommit(item)
      })
    },

    onReset() {
      if (this.popupResolved) {
        this.reload()
      } else {
        this.unsetChanged()
        this.itemsState = cloneDeep(this.items)
      }
    },
    onSave() {
      this.$refs.form.validate().then(async (success) => {
        if (success) {
          this.unsetChanged()
          this.$emit('saved')
          this.reload()
        }
      })
    },
    unsetChanged() {
      this.changed = false
      this.popupResolved = false
    },
    onAdd(type) {
      this.$router.push({
        name: 'edu.doc:create',
        params: {
          type: type,
          onResolve: this.onPopupResolve
        },
        query: {
          orderId: this.order._id
        }
      })
    },
    onOpen(item) {
      this.$router.push({
        name: 'edu.doc:edit',
        params: {
          entityId: item.id,
          onResolve: this.onPopupResolve
        }
      })
    },
    onPopupResolve() {
      this.popupResolved = true
      if (!this.changed) {
        this.reload()
      } else {
        alert('Обновления документа не отобразятся в таблице пока в ней есть несохраненные изменения')
      }
    },
    reload() {

    }
  },
  watch: {
    'storeOrder.docs'(v) {
      this.itemsState = cloneDeep(v)
      this.unsetChanged()
    },
  }
}
</script>


<style lang="scss" scoped>

.c-applications {

}

.c-section {
  border: 1px solid #dddddd;
}

</style>
