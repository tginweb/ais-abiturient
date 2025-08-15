<template>

  <div>


    <q-markup-table
        class="c-applications s-table body-no-padding-hor"
        flat
    >
      <tbody>

      <template v-for="role in docsRoles">

        <template v-if="docsGrouped[role.id]">

          <tr
              v-for="(item, index) in docsGrouped[role.id]"
              class="__item"
          >

            <td
                class=""
                style="cursor: pointer;white-space: normal;vertical-align: middle;"
                valign="top"
                @click="onOpen(item)"
            >
              <span class="cursor-pointer s-link s-font-md">
                {{ item.docTypeName }}
              </span>
            </td>

            <td
                class=""
                valign="top"
            >
              <div v-if="item.docSeries">
                <div class="s-font-xs text-grey">Серия:</div>
                {{ item.docSeries }}
              </div>
            </td>
            <td
                class=""
                valign="top"
            >
              <div v-if="item.docNumber">
                <div class="s-font-xs text-grey">Номер:</div>
                {{ item.docNumber }}
              </div>
            </td>
            <td
                style="white-space: normal;"
                valign="top"
            >
              <div v-if="item.createSourceInfo">
                <div class="s-font-xs text-grey">Cоздан:</div>
                {{ item.createSourceInfo.title }}
              </div>
            </td>
            <td
                valign="top"
            >
              <q-btn
                  v-if="item.canDeleteAbit"
                  color="red"
                  dense
                  icon="delete"
                  outline
                  size="14px"
                  @click="onDelete(item)"
              />
            </td>

          </tr>
        </template>

        <tr v-if="role.multiple || !docsGrouped[role.id]">
          <td colspan="8" style="border: 0;">
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
        
      </template>

      </tbody>

    </q-markup-table>

  </div>

</template>

<script>

import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep";

export default {
  props: {
    order: {},
    items: {},
    docRole: {},
    isForeigner: {}
  },
  data() {
    return {
      changed: false,
      popupResolved: false,
      itemsState: cloneDeep(this.items)
    }
  },
  computed: {

    docsRoles() {
      return this.order.docsRoles.filter(role => role.id === this.docRole)
    },

    docsGrouped() {
      return this.itemsState.reduce((map, doc) => {
        if (!map[doc.type]) {
          map[doc.type] = []
        }
        map[doc.type].push(doc)
        return map
      }, {})
    }

  },
  methods: {
    async onDeleteCommit(item) {
      const res = await this.$store.dispatch('gql/mutation', {
        mutation: require('~module/edu-org/modules/order/gql/order/mutation/doc_delete.gql'),
        variables: {
          id: item.id,
        }
      })
      if (res.result.success) {
        this.$emit('changed')
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
          this.$emit('changed')
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
          onResolve: this.onPopupResolve,
          isForeigner: this.isForeigner
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
      console.log('onPopupResolve')
      this.popupResolved = true
      this.unsetChanged()
      this.$emit('changed')
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


</style>
