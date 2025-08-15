<template>

  <div>

    <div class="s-info-section1 q-mb-xl">

      <div class="s-font-lg q-mb-sm text-weight-bold">Документы</div>

      <q-markup-table
        v-if="entity.epguDocs.length"
        class="c-achievements s-table-data"
        flat
      >
        <thead>
        <tr class="text-left">
          <th class="dense">
            <q-checkbox v-model="epguDocsSelectAll" dense/>
          </th>
          <th class="dense">ID</th>
          <th class="dense">Тип</th>
          <th class="dense">При креп лен</th>
          <th class="dense">Наименование</th>
          <th class="dense">Организация</th>
          <th class="dense">Серия / Номер / Дата</th>
          <th class="dense">Файл</th>
          <th class="dense">Про ве рен</th>
          <th class="dense">ЕПГУ_ИД заяв-ия</th>
          <th class="dense">Состояние</th>
        </tr>
        </thead>
        <tbody>

        <tr
          v-for="(item, index) in entity.epguDocs"
          :key="index"
          class="__item"
        >
          <td class="dense">
            <q-checkbox v-model="item.selected" :false-value="null" dense/>
          </td>
          <td class="__item__name dense">
            {{ item.id }}.{{ item.UIDEpgu }}
          </td>
          <td class="__item__name dense">
            {{ item.typeName }}
          </td>

          <td class="">

              <span v-if="item.attached">
                <q-icon color="green" name="far fa-check-circle" size="sm"/>
              </span>

          </td>

          <td class="__item__name dense">
            {{ item.doc.name }}
          </td>
          <td class="__item__name dense">
            {{ item.doc.organization }}
          </td>
          <td class="__item__name dense">
            <div v-if="item.doc.serial" style="white-space: nowrap;">Серия: {{ item.doc.serial }}</div>
            <div v-if="item.doc.number" style="white-space: nowrap;">Номер: {{ item.doc.number }}</div>
            <div v-if="item.doc.date || item.epguData.IssueDate" style="white-space: nowrap;">Дата:
              {{ item.doc.date || item.epguData.IssueDate }}
            </div>
            <div v-if="item.doc.subcode" style="">Код подразд.: {{ item.doc.subcode }}</div>
          </td>
          <td class="__item__doc dense">
                <span v-if="item.fileId">
                  <q-btn
                    :href="'/api/file/download?id=' + item.fileId"
                    :icon="$icons.fasDownload"
                    dense
                    flat
                    target="_blank"
                    type="a"
                  />
                </span>
          </td>

          <td class="__item__name dense">
            {{ item.doc.checked ? 'да' : 'нет' }}
          </td>
          <td class="__item__doc dense">
            {{ item.appUIDEpgu }}
          </td>

          <td class="__item__doc dense">

            <div v-if="item.epguState.imported">
              импортирован
            </div>

          </td>

        </tr>

        </tbody>
      </q-markup-table>

      <div class="flex q-gutter-md q-mt-md">

        <q-btn
          v-if="entity.epguDocs.find(item => item.selected && !item.attached)"
          class="q-mt-md"
          color="primary"
          label="Прикрепить"
          @click="onEpguDocsAttach(true)"
        />

        <q-btn
          v-if="entity.epguDocs.find(item => item.selected && item.attached)"
          class="q-mt-md"
          color="red"
          label="Открепить"
          @click="onEpguDocsAttach(false)"
        />

        <q-btn
          v-if="entity.epguDocs.find(item => item.selected )"
          class="q-mt-md q-ml-auto"
          color="primary"
          label="Импорт документов и загрузка файлов"
          @click="onEpguDocsImport"
        />

      </div>


    </div>

  </div>

</template>

<script>

export default {
  props: {
    entityInput: {},
  },
  components: {},
  data() {
    return {
      entity: this.entityInput,
      epguDocsSelectAll: false
    }
  },
  computed: {},
  created() {

  },
  methods: {



    async onEpguDocsAttach(status) {

      const docIds = this.entity.epguDocs.filter(item => item.selected).map(item => item._id)

      if (docIds.length) {

        this.$q.dialog({
          title: status ? 'Прикрепление' : 'Открепление',
          message: status ? 'Вы действительно хотите ПРИКРЕПИТЬ документы к заявлению' : 'Вы действительно хотите ОТКРЕПИТЬ документы от заявления',
          cancel: true,
          persistent: true
        }).onOk(async () => {

          const res = await this.$store.dispatch(
            'edu_order/entityEpguDocActionMultiple', {
              _id: this.entity._id,
              docIds: docIds,
              action: status ? 'attach' : 'detach',
            }
          )

          this.$bus.emit('processMessages', res.result.messages);

          this.$emit('refetch')
        })

      }

    },

    async onEpguDocsImport() {

      const targets = this.entity.epguDocs.filter(item => item.selected).map(item => 'edu_order.epguDoc:' + this.entityId + '.' + item.id)

      if (targets.length) {

        const res = await this.$store.dispatch(
          'edu_epgu_task/entityAddFromTargets', {
            targets: targets,
            action: 'import',
          }
        )

        this.$bus.emit('processMessages', res.result.messages);
      }

    },

  },
  watch: {
    entityInput(val) {
      this.entity = val
    },
    entity(val) {
      this.$emit('update:entityInput', val)
    },
    epguDocsSelectAll(val) {
      this.entity.epguDocs.forEach(doc => {
        doc.selected = val || null
      })
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
