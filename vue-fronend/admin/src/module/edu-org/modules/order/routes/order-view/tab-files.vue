<template>

  <div style="position: relative;">

    <q-dialog v-model="printPacket.visible">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Печать документов</div>
          <q-space/>
          <q-btn v-close-popup dense flat icon="close" round/>
        </q-card-section>
        <q-card-section>

          <q-option-group
              v-model="printPacket.selected"
              :options="packetTemplates"
              color="green"
              type="checkbox"
          />
        </q-card-section>
        <q-card-section>
          <q-btn
              label="Печать"
              @click="onPrintPacket"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-gutter-x-md flex q-pb-lg">

      <q-btn
          color="primary"
          icon="print"
          label="печать пакета"
          size="md"
          @click="printPacket.visible=true"
      />

      <q-space/>

      <q-btn
          v-if="changed"
          color="primary"
          icon="save"
          label="Сохранить изменения"
          size="md"
          @click="onSave"
      />

      <q-btn
          v-if="changed"
          color="red"
          icon="do_not_disturb_on"
          label="Сбросить изменения"
          outline
          size="md"
          @click="onReset"
      />

    </div>

    <el-print-template ref="print">
      <component :is="printIs" v-slot="scope" :vars="{order: order}"></component>
    </el-print-template>


    <el-print-template ref="printMultiple">

      <div
          v-for="printComponent of printPacket.selected"
          :key="printComponent"
          style="page-break-before: always;"
      >
        <component
            :is="printComponent"
            v-slot="scope"
            :vars="{order: order}"
        />
      </div>

    </el-print-template>


    <q-form ref="form">


      <q-markup-table
          class="c-applications s-table"
          flat
      >
        <tbody>

        <template v-for="role in docRoles">

          <tr style="background-color: #efefef;">
            <td class="text-bold s-font-md" colspan="11">{{ role.title }}</td>
          </tr>

          <template v-if="docsGrouped[role.id]">

            <tr
                v-for="(item, index) in docsGrouped[role.id]"
                :class="{
                  ['s-save-action-' + ( item.toDelete ? 'delete': (item.toUpdate? 'update':'') ) ]: true
                }"
                class="__item"
                @mouseleave="itemHover = null"
                @mouseover="itemHover = item"
            >
              <td class="" style="width: 50px;border:0;">
              </td>
              <td
                  class=""
                  style="cursor: pointer; width: 40%;"
              >
                <span class="cursor-pointer s-link s-font-md" @click="onOpen(item)">
                  {{ item.docTypeName }}
                </span>

              </td>

              <td>
                <div v-if="(item.type === 'education' || item.type==='passport')">
                  <q-badge v-if="item.isMain" class="q-mr-md" color="yellow-9" style="font-size:14px">главный</q-badge>

                  <q-btn
                      v-if="itemHover === item && !changed"
                      class=" q-px-sm"
                      color="primary"
                      dense
                      label="главным"
                      no-wrap
                      outline
                      size="12px"
                      @click="onChangeMain(item)"
                  />
                </div>

              </td>
              <td class="">
                <div v-if="item.docSeries">
                  <div class="s-font-xs text-grey">Серия:</div>
                  {{ item.docSeries }}
                </div>
              </td>
              <td class="">
                <div v-if="item.docNumber">
                  <div class="s-font-xs text-grey">Номер:</div>
                  {{ item.docNumber }}
                </div>
              </td>
              <td>
                <div v-if="item.createSourceInfo && !item.roleInfo.internal">
                  <div class="s-font-xs text-grey">Источник:</div>
                  {{ item.createSourceInfo.title }}
                </div>
              </td>
              <td>
                <div v-if="item.epgu.guid" @dblclick="showAdditional=!showAdditional">
                  <div class="s-font-xs text-grey text-no-wrap">На ЕПГУ:</div>
                  ДА

                  <div v-if="showAdditional">
                    {{ item.epgu.guid }}
                  </div>
                </div>
              </td>
              <td class="">

                <div v-if="item.status && item.status.final" class="text-bold">
                  {{ item.status.title }}
                </div>

                <q-select
                    v-else-if="!item.roleInfo.internal"
                    v-model="item.statusId"
                    :options="$store.getters['edu_doc/statusesOptions']"
                    :required="true"
                    dense
                    emit-value
                    map-options
                    option-label="title"
                    option-value="id"
                    outlined
                    @input="changed = true, item.toUpdate = true"
                />

              </td>
              <td
                  style="width: 50px;"
              >
                <q-btn
                    v-if="item.printComponent"
                    class="q-ml-auto"
                    color="secondary"
                    icon="print"
                    label="печать"
                    no-wrap
                    outline
                    size="14px"
                    @click="onPrint(item.printComponent)"
                />
              </td>
              <td class="">
                <q-btn
                    v-if="item.files && item.files.length"
                    :href="item.downloadPdfUrl"
                    class="q-px-sm"
                    color="primary"
                    dense
                    icon="download"
                    label="скачать"
                    no-wrap
                    target="_blank"
                    type="a"
                    unelevated
                />

              </td>
              <td>
                <div v-if="item.toDelete">
                  будет удален при сохранении
                </div>
                <div v-else-if="item.toUpdate">
                  будет изменен при сохранения
                </div>
                <q-btn
                    v-else-if="item.canDeleteAdmin"
                    color="red"
                    dense
                    icon="delete"
                    outline
                    @click="onDelete(item)"
                />
              </td>

            </tr>
          </template>

          <tr v-if="role.multiple || !docsGrouped[role.id]">
            <td style="border: 0;"></td>
            <td colspan="9" style="border: 0;">
              <q-btn
                  :label="'Добавить документ'"
                  class="q-px-md"
                  color="primary"
                  dense
                  outline
                  size="13px"
                  @click="onAdd(role.id)"
              />
            </td>
          </tr>
          <tr v-else-if="role.id === 'packet'">
            <td style="border: 0;"></td>
            <td colspan="10" style="border: 0;">
              <q-btn
                  :label="'Добавить пакет документов'"
                  class="q-px-md"
                  color="primary"
                  dense
                  outline
                  size="13px"
                  @click="onAddPacket"
              />
            </td>
          </tr>

          <tr style="height: auto;">
            <td colspan="11" style="padding: 8px !important;border: 0;height: auto !important;"></td>
          </tr>

        </template>

        </tbody>

      </q-markup-table>
    </q-form>

  </div>

</template>

<script>

import CParent from "./tab"
import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep";

export default {
  extends: CParent,
  components: {
    'tpl-print-consent': () => import('@project/components/templates/print/consent'),
    'tpl-print-consent-dist': () => import('@project/components/templates/print/consent-dist'),
    'tpl-print-app-bak': () => import('@project/components/entity/order/templates/print/bak-order'),
    'tpl-print-app-mag': () => import('@project/components/entity/order/templates/print/mag-order'),
    'tpl-print-app-spo': () => import('@project/components/entity/order/templates/print/spo-order'),
    'tpl-print-app-asp': () => import('@project/components/entity/order/templates/print/asp-order'),
    'tpl-print-opis': () => import('@project/components/entity/order/templates/print/opis'),
    'tpl-print-kvitok': () => import('@project/components/templates/print/kvitok'),
    'tpl-print-raspiska': () => import('@project/components/templates/print/raspiska'),
  },
  props: {
    items: {}
  },
  data() {
    return {
      popupResolved: false,
      itemsState: cloneDeep(this.items),
      itemHover: null,
      printIs: null,
      printPacket: {
        visible: false,
        selected: []
      },
      showAdditional: false
    }
  },
  computed: {

    packetTemplates() {
      return [
        {
          label: 'Квиток',
          value: 'tpl-print-kvitok',
        },
        {
          label: 'Согласие',
          value: 'tpl-print-consent',
        },
        {
          label: 'Согласие на распространение',
          value: 'tpl-print-consent-dist',
        }
      ]
    },
    docRoles() {
      return this.order.docsRoles.filter(item => !item.parent)
    },
    docsForSave() {
      let res = []
      for (let [group, docs] of Object.entries(this.docsGrouped)) {
        res = [...res, ...docs]
      }
      return res.reduce((map, item) => {
        map[item.id] = {
          id: item.id,
          statusId: item.statusId,
          toDelete: item.toDelete,
        }
        return map
      }, {})
    },

    docsGrouped() {
      return this.itemsState.reduce((map, doc) => {

        if (['app', 'consent', 'consent_dist', 'photo', 'kvitok', 'raspiska', 'opis'].indexOf(doc.type) > -1) {
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
    onPrintPacket() {
      this.$refs.printMultiple.print();
    },
    async onAddPacket() {
      await this.$store.dispatch('edu_order/apiMutate', {
        mutation: 'action',
        action: 'ensure_docs_internal',
        ids: [this.order._id]
      })
      this.reload()
    },
    onPrint(com) {
      this.printIs = com
      setTimeout(() => {
        this.$refs.print.print();
      }, 300)

    },
    async onChangeMain(item) {
      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/order/mutation/docsSetMain.gql'),
          variables: {
            id: this.order.id,
            docId: item.id,
            role: item.type
          }
        })
        if (res.result.success) {
          this.unsetChanged()
          this.$emit('saved')
          this.reload()
        }
      } catch (e) {
        console.log(e)
      }
    },

    onDelete(item) {
      this.$set(item, 'toDelete', true)
      this.changed = true
    },
    onReset() {
      if (this.popupResolved) {
        this.reload()
      } else {
        this.unsetChanged()
        this.itemsState = cloneDeep(this.items)
      }
    },
    async onSaveCommit() {
      const data = {}


      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/order/mutation/docsSave.gql'),
          variables: {
            id: this.order.id,
            data: this.docsForSave
          }
        })
        if (res.result.success) {
          this.unsetChanged()
          this.$emit('saved')
          this.reload()
        }
      } catch (e) {
        console.log(e)
      }

    },
    async onSave() {
      if (await this.$refs.form.validate()) {
        await this.onSaveCommit()
      } else {
        const errorElm = this.$refs.form.$el.querySelector('.q-field--error')
        if (errorElm) {
          this.$util.dom.scrollTo({el: errorElm, target: '.c-modal-scroll', offset: 80, duration: true})
        }
      }
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
      this.reload()
    },
  },
  watch: {
    items(v) {
      this.itemsState = cloneDeep(v)
      this.unsetChanged()
    },
  }
}
</script>

<style lang="scss" scoped>

.s-save-action-delete {
  background-color: #ecc7c7;
}

.s-save-action-update {
  background-color: #f1f0da;
}

</style>
