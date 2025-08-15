<template>

  <div>

    <div class="row q-col-gutter-x-md q-col-gutter-y-lg q-mb-lg">

      <div class="col-24 col-lg-12">

        <COrderSectionPersonal :order="entity"></COrderSectionPersonal>
        <COrderSectionEducation :order="entity"></COrderSectionEducation>
        <COrderSectionAddress :order="entity"></COrderSectionAddress>
        <COrderSectionOther :order="entity"></COrderSectionOther>

      </div>

      <div class="col-24 col-lg-12 q-gutter-y-lg">

        <div class="com s-info-section">

          <div class="flex items-center q-mb-sm">
            <div class="__header q-mb-none" style="margin: 0;">Заявления</div>
            <div class="q-ml-auto">
              <a href="#" class="text-primary" @click.prevent="tab='apps'">
                <span style="text-decoration: underline;">перейти к подробностям</span>
                <q-icon :name="$icons.chevronRight" class="q-ml-sm" size="14px"/>
              </a>
            </div>
          </div>

          <q-markup-table
              v-if="entity.applications.items.length>0"
              class="c-applications s-table-data"
              flat
          >
            <thead>
            <tr>

              <th title="Приоритет">
                <div style="white-space: nowrap">ПР-Т</div>
              </th>
              <th>Направление</th>
              <th>Подано</th>
              <th>Статус в ЛК</th>
              <th>Согл</th>
            </tr>
            </thead>
            <tbody>

            <tr
                v-for="(item, index) in entity.applications.items"
                :style="{
                    backgroundColor1: item.deleted ? '#FFF0F0' : ''
                  }"
                class="__item"
            >

              <td class="dense">

                {{ item.priority }}

              </td>

              <td class="">


                <div v-if="item.admission" :title="item.admission.id + '.' + item.source.id">

                  {{ item.admission.abbr }}

                  {{ item.admission.direct_name }}

                  <div class="text-weight-bold">
                    {{ item.admission.fob.name }}
                  </div>

                </div>

                <div v-if="item.source" class="text-grey-8">
                  {{ item.source.name }}
                </div>

              </td>

              <td class="">

                <div class="q-gutter-y-xs">

                  <div>
                    <div v-if="item.cappsource==='epgu'">
                      <b>ЕПГУ</b>
                    </div>
                    <div v-else>
                      <b>ЛК</b>
                    </div>
                  </div>

                </div>

              </td>

              <td class="">

                <template v-if="false">

                  <div v-if="item.status" class="">
                    {{ item.status.name }}
                  </div>

                  <div v-if="item.statusMessage" class="q-mt-sm">
                    Сообщение: {{ item.statusMessage }}
                  </div>

                  <div v-if="item.deleted" class="q-mt-sm">
                        <span class="bg-red q-px-sm text-white" style="white-space: nowrap;">
                          удалено через {{ {lk: 'ЛК', epgu: 'ЕПГУ', admin: 'ИРНИТУ'}[item.deletedSource] }}
                        </span>
                  </div>

                </template>


              </td>
              <td>
                <span v-if="item.agree"><q-icon name="far fa-check-circle" color="green"/> согласие</span>
                <span v-else-if="item.agreeDeny"><q-icon name="fas fa-ban" color="red"/> отказ</span>
              </td>
            </tr>

            </tbody>

          </q-markup-table>

          <div v-else class="text-grey-7">
            направления не выбраны
          </div>


        </div>

        <COrderSectionSubjects :order="entity"></COrderSectionSubjects>
        <COrderSectionAchievements :order="entity"></COrderSectionAchievements>
        <COrderSectionQuotes :order="entity"></COrderSectionQuotes>

        <COrderSectionFilesAdmin :order="entity"/>

      </div>


    </div>

  </div>

</template>

<script>
import CParent from "./tab"
import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep";
import * as sections from '@project/components/entity/order/section'
export default {
  extends: CParent,
  props: {
    order: {},
    items: {}
  },
  components: {
    ...sections
  },
  data() {
    return {
      entity: this.order,
      orderData: this.order,
      changed: null,
      canEditPersonal: true,
      edit: false
    }
  },
  computed: {

    usedSubjectIds() {
      return this.itemsState.reduce((map, item) => {
        map[item.csubject] = item.csubject
        return map
      }, {})
    },

    admissionsWithSubjects() {

      const res = {}

      this.order.appGroups.forEach(appGroup => {

        appGroup.apps.forEach(app => {

          const cadmission = app.competition.admission.id
          const admission = app.competition.admission

          app.competition.admission.subjects.forEach(subj => {

            if (!res[cadmission]) {
              res[cadmission] = {
                name: admission.name,
                groups: {}
              }
            }

            if (!res[cadmission].groups[subj.number]) {
              res[cadmission].groups[subj.number] = {
                status: false,
                subjects: {}
              }
            }

            res[cadmission].groups[subj.number].subjects[subj.csubject] = subj.csubject

            if (this.usedSubjectIds[subj.csubject]) {
              res[cadmission].groups[subj.number].status = true
            }

          })

        })

      })


      return res
    },
  },
  created() {

  },
  methods: {
    onDelete(item) {
      if (!item.id)
        this.itemsState = this.itemsState.filter(test => test !== item)

    },

    onReset() {
      this.unsetChanged()
      this.itemsState = cloneDeep(this.items)
    },
    onSave() {

      this.$refs.form.validate().then(async (success) => {
        if (success) {

          this.unsetChanged()
          this.$emit('saved')
        }
      })

    },
    isChanged() {
      return this.changed
    },
    unsetChanged() {
      this.changed = false
    },
    onAdd(csubject) {
      this.itemsState.push({
        csubject: csubject
      })
      this.changed = true
    }
  },
  watch: {
    items(v) {
      this.itemsState = cloneDeep(v)
    }
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
