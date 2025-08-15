<template>

  <div>

    <div class="q-gutter-x-md flex q-pb-lg q-mt-sm">

      <q-btn
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
        <div class="__header text-bold">Вступительные испытания</div>
        <q-markup-table
            v-if="itemsState.length"
            class="c-subjects s-table q-mb-md"
            flat
        >
          <thead>
          <tr class="text-left">
            <th class="dense">Предмет</th>
            <th>Основание для оценки</th>
            <th>Балл ЕГЭ по версии абитуриента</th>
            <th>Год ЕГЭ по версии абитуриента</th>
            <th>Балл результат</th>
            <th>Основание результата</th>
            <th></th>
          </tr>
          </thead>
          <tbody>

          <tr
              v-for="item in itemsState"
              :key="item.id"
              :class="{
                's-to-delete': item.toDelete
              }"
              class="__item"
          >
            <td class="__item__label dense">
              <ui-input-select
                  v-model="item.csubject"
                  :options="$store.state.edu_subject.app.items"
                  :readonly="!!item.id"
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
            <td class="__item__result">
              <q-select
                  v-model="item.passingType"
                  :options="[
                      {
                        id: 'ege',
                        name: 'Свидетельство ЕГЭ',
                      },
                      {
                        id: 'internal',
                        name: 'Внутреннее испытание ОУ',
                      },
                      {
                        id: 'olimp',
                        name: 'Диплом победителя-призера олимпиады',
                      },
                      {
                        id: 'gia',
                        name: 'Справка ГИА',
                      },
                  ]"
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
            <td class="__item__result">
              <q-input
                  v-if="item.passingType==='ege'"
                  v-model="item.abitEgeBall"
                  dense
                  outlined
                  @input="changed = true"
                  readonly
              />
            </td>
            <td class="__item__result">
              <q-select
                  v-if="item.passingType==='ege'"
                  v-model="item.abitEgeYear"
                  dense
                  outlined
                  @input="changed = true"
                  :options="[
                      {value: '2023', label: '2023'},
                      {value: '2022', label: '2022'},
                      {value: '2021', label: '2021'},
                      {value: '2020', label: '2020'},
                      {value: '2019', label: '2019'},
                  ]"
                  map-options
                  emit-value
                  readonly
              />
            </td>
            <td class="__item__status">
              <q-input
                  v-if="accessTestResultEdit && (true || item.passingType==='internal' || item.passingType==='gia')"
                  v-model="item.resultBall"
                  dense
                  outlined
                  @input="changed = true"
              />
               <span class="s-font-xxl" v-else>
                    {{ item.resultBall }}
               </span>
            </td>

            <td class="__item__status">
              {{ item.resultSourceDocTitle }}
            </td>
            <td>
              <q-btn
                  v-if="!item.id || item.canDeleteAdmin || true"
                  color="red"
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

    <div class="com s-info-section">


      <q-expansion-item
          v-model="expanded"
          class="q-mt-md"
          :label="'Предметы по направлениям ' + (!admissionsWithSubjects.status ? ' - НЕ ХВАТАЕТ ПРЕДМЕТОВ!' : '')"
          switch-toggle-side
          :header-class="{
            'q-mb-md': true,
            'bg-red-1': !admissionsWithSubjects.status
          }"
      >
        <q-markup-table
            class="c-subjects s-table q-mb-md"
            flat
        >
          <thead>
          <tr class="text-left">
            <th class="dense">Набор</th>
            <th>Предмет 1</th>
            <th>Предмет 2</th>
            <th>Предмет 3</th>
            <th>Предмет 4</th>
            <th>Предмет 5</th>
          </tr>
          </thead>
          <tbody>

          <tr
              v-for="(adm, cadmission) of admissionsWithSubjects.items"
              :key="cadmission"
              class="__item"
          >
            <td class="__item__label dense">
              {{ adm.name }}
            </td>

            <template
                v-for="priority in [1,2,3,4,5]"
            >
              <td
                  :key="priority"
                  :class="{
                    'bg-red-2': adm.groups[priority] && !adm.groups[priority].status
                  }"
                  class="__item__label dense"
              >

                <template v-if="adm.groups[priority]">

                  <ul class="q-pl-md q-mt-none">
                    <li
                        v-for="csubject of adm.groups[priority].subjects"
                        :class="{
                      'selected-test': usedSubjectIds[csubject]
                    }"
                        class="q-mb-sm"
                    >
                      <template v-if="adm.groups[priority].status">
                        {{ $store.getters['edu_subject/byId'][csubject].name }}
                      </template>
                      <template v-else>
                        <a href="#" @click.prevent="onAdd(csubject)">
                          {{ $store.getters['edu_subject/byId'][csubject].name }}
                        </a>
                      </template>

                    </li>
                  </ul>

                </template>

              </td>

            </template>

          </tr>
          </tbody>

        </q-markup-table>
      </q-expansion-item>
    </div>

  </div>

</template>

<script>
import CParent from './tab'
import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep";

export default {
  extends: CParent,
  props: {
    items: {}
  },
  components: {},
  data() {
    return {
      itemsState: cloneDeep(this.items),
      expanded: false
    }
  },
  computed: {
    accessTestResultEdit() {
      return !!this.order.perms.test_result_edit
    },
    usedSubjectIds() {
      return this.itemsState.reduce((map, item) => {
        map[item.csubject] = item.csubject
        return map
      }, {})
    },
    admissionsWithSubjects() {

      const res = {
        items: {},
        status: true
      }

      this.order.appGroups.forEach(appGroup => {

        appGroup.appsActive.forEach(app => {

          const cadmission = app.competition.admission.id
          const admission = app.competition.admission

          app.competition.admission.subjects.forEach(subj => {

            const priority = subj.number || 1

            if (!res.items[cadmission]) {
              res.items[cadmission] = {
                name: admission.name,
                groups: {}
              }
            }

            if (!res.items[cadmission].groups[priority]) {
              res.items[cadmission].groups[priority] = {
                status: false,
                subjects: {}
              }
            }

            res.items[cadmission].groups[priority].subjects[subj.csubject] = subj.csubject

            if (this.usedSubjectIds[subj.csubject]) {
              res.items[cadmission].groups[priority].status = true
            }

          })

        })

      })

      for (let [cadmission, adm] of Object.entries(res.items)) {
        for (let [priority, group] of Object.entries(adm.groups)) {
          if (!group.status) {
            res.status = false
          }
        }
      }

      return res
    },
  },
  created() {

  },
  methods: {
    onDelete(item) {
      if (!item.id) {
        this.itemsState = this.itemsState.filter(test => test !== item)
      } else {
        this.$set(item, 'toDelete', true)
        this.changed = true
      }
    },
    onReset() {
      this.unsetChanged()
      this.itemsState = cloneDeep(this.items)
    },
    async onSaveCommit() {

      const data = this.itemsState.map(item => ({
        isNew: item.isNew,
        toDelete: item.toDelete,
        id: item.id,
        _id: item._id,
        nid: item.nid,
        csubject: item.csubject,
        passingType: item.passingType,
        abitEgeBall: parseFloat(item.abitEgeBall),
        abitEgeYear: parseInt(item.abitEgeYear),
        resultBall: parseFloat(item.resultBall)
      }))

      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/order/mutation/testsSave.gql'),
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
    onAdd(csubject) {
      this.itemsState.push({
        isNew: true,
        csubject: csubject
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


.s-to-delete {
  background-color: #f3afaf;
}

</style>
