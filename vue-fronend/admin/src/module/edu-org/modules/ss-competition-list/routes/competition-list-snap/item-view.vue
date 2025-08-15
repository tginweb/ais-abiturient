<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actionsClose="true"
    :loading="fetching"
    :title="'Абитуриент ' + (entity && entity.fio)"
    @hide="onHide"
    dialogWidth="900px"
    v-if="entity"
  >

    <q-tabs
      v-model="tab"
      active-bg-color="secondary"
      active-color="white"
      align="justify"
      class=" text-secondary bg-grey-4"
      dense
      indicator-color="white"
      narrow-indicator

    >
      <q-tab label="Данные" name="common"/>
      <q-tab label="Документы" name="docs"/>
      <q-tab label="Достижения" name="achievements"/>
    </q-tabs>

    <q-separator/>

    <q-tab-panels v-model="tab" animated>

      <q-tab-panel class="q-px-none" name="common">

        <div class="q-mb-md s-font-xl">Общее</div>

        <q-markup-table
          class="s-table-data"
          flat
          style="max-width: 300px"
        >
          <tbody>
          <tr>
            <td>ID</td>
            <td>{{entity._id}}</td>
          </tr>
          <tr>
            <td>ФИО</td>
            <td>{{entity.fio}}</td>
          </tr>
          <tr>
            <td>СНИЛС</td>
            <td>{{entity.snils}}</td>
          </tr>
          </tbody>
        </q-markup-table>

        <div class="q-mt-md q-mb-md s-font-xl">Результаты ЕГЭ</div>

        <q-markup-table
          class="s-table-data"
          flat
          style="max-width: 300px"
        >
          <tbody>
            <tr v-for="(mark, subject) of entity.egeRes">
              <td>{{subject}}</td>
              <td>{{mark}}</td>
            </tr>
          </tbody>
        </q-markup-table>


      </q-tab-panel>

      <q-tab-panel class="q-px-none" name="docs">

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
            <th class="dense">Наименование</th>
            <th class="dense">Серия / Номер / Дата</th>
            <th class="dense">Файл</th>
            <th class="dense">Проверен</th>
            <th class="dense">Состояние</th>
          </tr>
          </thead>
          <tbody>

          <tr
            v-for="(item, index) in entity.epguDocs.filter(item => item.type !=='achievement')"
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
              {{ item.typeName || item.type }}
            </td>
            <td class="__item__name dense">
              {{ item.doc.name }}
            </td>

            <td class="__item__name dense">


              <div class="q-gutter-y-xs">
                <div v-if="item.doc.serial" style="white-space: nowrap;">
                  <span class="text-grey-6">Серия:</span> {{ item.doc.serial }}
                </div>
                <div v-if="item.doc.number" style="white-space: nowrap;">
                  <span class="text-grey-6">Номер:</span> {{ item.doc.number }}
                </div>
                <div v-if="item.doc.date || item.epguData.IssueDate" style="white-space: nowrap;">
                  <span class="text-grey-6">Дата:</span>
                  {{ item.doc.date || item.epguData.IssueDate }}
                </div>
                <div v-if="item.doc.subcode" style="">
                  <span class="text-grey-6">Код подразд.:</span> {{ item.doc.subcode }}
                </div>
                <div v-if="item.doc.organization">
                  <span class="text-grey-6">Организация:</span> {{ item.doc.organization }}
                </div>
              </div>

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

              <div v-if="item.epguState.imported">
                импортирован
              </div>

            </td>

          </tr>

          </tbody>
        </q-markup-table>

      </q-tab-panel>

      <q-tab-panel class="q-px-none" name="achievements">

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
            <th class="dense">Наименование</th>
            <th class="dense">Файл</th>
            <th class="dense">Состояние</th>
          </tr>
          </thead>
          <tbody>

          <tr
            v-for="(item, index) in entity.epguDocs.filter(item => item.type ==='achievement')"
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
              {{ item.category && item.category.name || item.typeName}}
            </td>
            <td class="__item__name dense">
              {{ item.doc.name }}
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

            <td class="__item__doc dense">

              <div v-if="item.epguState.imported">
                импортирован
              </div>

            </td>

          </tr>

          </tbody>
        </q-markup-table>

      </q-tab-panel>

    </q-tab-panels>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {},
  components: {},
  data() {
    return {
      dialogIs: 'ui-admin-dialog',
      tab: this.$store.getters['edu_ss_entrant/viewDefaultTab'],
      epguDocsSelectAll: false,
    }
  },
  computed: {

    entityViewTree() {

      const res = []

      const entity = this.entity

      res.push({
        label: 'Общее',
        expanded: true,
        children: [
          {label: '_id', value: entity._id},
          {label: 'ID', value: entity.id},
          {label: 'Аббривиатура', value: entity.abbr},
          {label: 'Год', value: entity.yr}
        ]
      })

      if (entity.subjects && entity.subjects.length) {

        let rows = []

        entity.subjects.forEach((subject) => {

          let subjectName
          let subjectRows = [
            {label: 'ID', value: subject.csubject}
          ]

          if (subject.subject) {
            subjectName = subject.subject.name
            subjectRows.push(
              {label: 'Name', value: subject.subject.name}
            )
          } else {
            subjectName =  'Предмет ' + subject.csubject
          }

          subjectRows.push(
            {label: 'Минимальный балл', value: subject.minimal}
          )

          subjectRows.push(
            {label: 'Номер', value: subject.number}
          )

          rows.push({
            label: subjectName,
            children: subjectRows
          })
        })

        res.push({
          label: 'Предметы',
          children: rows
        })
      }

      if (entity.direction)
        res.push({
          label: 'Направление',
          children: [
            {label: '_id', value: entity.direction._id},
            {label: 'ID', value: entity.direction.id},
            {label: 'Cod', value: entity.direction.cod},
            {label: 'Name', value: entity.direction.name},
            {label: 'Cperson', value: entity.direction.cperson},
            {label: 'Cugspec', value: entity.direction.cugspec},
            {label: 'Dubl', value: entity.direction.dubl},
            {label: 'Abbr', value: entity.direction.abbr},
            {label: 'Code', value: entity.direction.code},
          ]
        })


      return res
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      await this.fetchingMethod(async () => {
        this.entity = this.entity || await this.$store.dispatch('edu_ss_entrant/querySingle', this.entityId)
      })
    },
  },

  watch: {
    tab(val) {
      this.$store.commit('edu_ss_entrant/VIEW_DEFAULT_TAB', val)
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
