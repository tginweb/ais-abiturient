<template>

  <div>

    <div class="q-gutter-x-md flex q-pb-lg q-mt-sm">

      <q-btn
          color="primary"
          icon="fas fa-plus"
          label="добавить индивидульное достижение"
          outline
          size="md"
          @click="onAdd"
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

    <q-form ref="form" class="q-mb-lg">
      <div class="com s-info-section ">
        <div class="__header text-bold">Достижения</div>

        <q-markup-table
            v-if="itemsState.length"
            class="c-subjects s-table q-mb-md"
            flat
        >
          <thead>
          <tr class="text-left">
            <th class="dense">Категория</th>
            <th>Документ</th>
            <th>Статус</th>
            <th>Балл</th>
            <th>Операции</th>
          </tr>
          </thead>
          <tbody>

          <tr
              v-for="(item,index) in itemsState"
              :key="item.id"
              class="__item"
          >
            <td class="__item__label dense">

              <q-select
                  v-model="item.achievementType"
                  :options="$store.getters['edu_achievement/typesByEduType'][order.eduType]"
                  :readonly="!!item._id"
                  :required="true"
                  dense
                  emit-value
                  map-options
                  option-label="name"
                  option-value="id"
                  outlined
                  @input="changed = true"
              />

            </td>
            <td>

              <div class="flex q-gutter-x-md no-wrap items-center">

                <q-select
                    v-model="item.docId"
                    :options="docsOptions"
                    :required="true"
                    class="full-width"
                    clearable
                    dense
                    emit-value
                    map-options
                    option-label="title"
                    option-value="id"
                    outlined
                    @input="changed = true"
                />

                <q-btn
                    v-if="selectedDocs[index]"
                    :href="selectedDocs[index].downloadPdfUrl"
                    class="q-px-sm"
                    color="primary"
                    dense
                    icon="download"
                    no-wrap
                    size="15px"
                    target="_blank"
                    type="a"
                    unelevated
                />

                <q-btn
                    v-if="selectedDocs[index]"
                    :to="'/admin/edu/doc/'+selectedDocs[index].id+'/edit'"
                    class="q-px-sm"
                    color="primary"
                    dense
                    icon="visibility"
                    no-wrap
                    size="15px"
                    unelevated
                />

              </div>

            </td>
            <td>
              <q-select
                  v-model="item.statusId"
                  :options="$store.state.edu_achievement.app.statuses"
                  :required="true"
                  dense
                  emit-value
                  map-options
                  option-label="title"
                  option-value="id"
                  outlined
                  @input="changed = true"
              />
            </td>
            <td>
              <q-input
                  v-if="item.statusId==='approved_vuz'"
                  v-model="item.ball"
                  dense
                  outlined
                  @input="changed = true"
              />
              <div v-else class="s-font-xl text-bold">
                {{item.ball}}
              </div>
            </td>
            <td>
              <q-btn
                  v-if="item.isNew || item.canDeleteAdmin"
                  color="red"
                  dense
                  icon="delete"
                  outline
                  @click="onDelete(item)"
              />
            </td>
          </tr>
          </tbody>

        </q-markup-table>
      </div>
    </q-form>

  </div>

</template>

<script>
import CParent from './tab'
import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep";

export default {
  extends: CParent,
  props: {
    items: {},
  },
  components: {},
  data() {
    return {
      itemsState: cloneDeep(this.items),
    }
  },
  computed: {
    selectedDocs() {
      return this.itemsState.map(item => this.docsById[item.docId])
    },
    docsById() {
      return this.order.docs.reduce((map, item) => {
        map[item.id] = item
        return map
      }, {})
    },
    docsOptions() {
      return this.order.docs
          .filter(doc => doc.type === 'education' || doc.type === 'achievement')
          .map(doc => {
            return {
              id: doc.id,
              title: doc.docTypeName,
            }
          })
    }
  },
  created() {

  },
  methods: {
    async onDelete(item) {
      if (item.isNew) {
        this.itemsState = this.itemsState.filter(test => test !== item)
      } else {

        this.$q.dialog({
          title: 'Удалить достижение',
          cancel: true,
          persistent: true
        }).onOk(async () => {

          try {
            const res = await this.$store.dispatch('gql/mutation', {
              mutation: require('../../gql/order/mutation/achievmentDelete.gql'),
              variables: {
                id: this.order._id,
                achievementId: item.id
              }
            })
            if (res.result.success) {
              this.itemsState = this.itemsState.filter(test => test !== item)
            }
          } catch (e) {
            console.log(e)
          }

        })
      }

    },
    onReset() {
      this.unsetChanged()
      this.itemsState = cloneDeep(this.items)
    },

    async onSaveCommit() {

      const data = this.itemsState.map(item => ({
        isNew: item.isNew,
        id: item.id,
        achievementType: item.achievementType,
        statusId: item.statusId,
        docId: item.docId,
        ball: item.ball,
      }))

      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/order/mutation/achievmentsSave.gql'),
          variables: {
            id: this.order._id,
            data: data
          }
        })
        if (res.result.success) {
          this.unsetChanged()
          this.reload()
        }
      } catch (e) {
        console.log(e)
      }

    },
    async onSave() {
      if (await this.$refs.form.validate())
        await this.onSaveCommit()
    },

    onAdd() {
      this.itemsState.push({
        isNew: true
      })
      this.changed = true
    }
  },
  watch: {
    items(v) {
      this.itemsState = cloneDeep(v)
    },
  }
}

</script>

<style lang="scss" scoped>

.selected-test {
  font-weight: bold;
}

td.error {
  background-color: #f3afaf;
}

</style>
