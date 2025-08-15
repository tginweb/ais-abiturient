<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :actions="actions"
      :context="{entity}"
      :loaded="mState.fetched"
      :title="entity ? entity.NAME : 'Договор'"
      dialogWidth="1150px"
      @hide="onHide"
      :toolbar="entity && entity.ACTIONS"
      :toolbar-exclude="['edit']"
      :tabs="modesTabs"
      :tab.sync="modeId"
  >

    <template v-slot:default="{entity}">

      <q-tab-panels v-model="modeId" animated class="" v-if="entity">

        <q-tab-panel class="q-px-none" name="common">

          <div class="row q-col-gutter-lg ">

            <div class="col-24 col-md-12">

              <div class="q-gutter-y-md">

                <ui-admin-data-card
                    title="Договор"
                    :fields="[
                    {label: 'Номер договора', value: entity.NUMBER}
                  ]"
                />

                <ui-admin-data-card
                    title="Плательщик"
                    :fields="[
                    {label: 'ФИО', value: entityState.BUYER_NAME},
                    {label: 'Дата рождения', value: entityState.BUYER_BIRTHDAY},
                    {label: 'Телефон', value: entityState.BUYER_PHONE},
                    {label: 'E-mail', value: entityState.BUYER_EMAIL},
                  ]"
                />

                <ui-admin-data-card
                    title="Ученик"
                    :fields="[
                    {label: 'ФИО ученика', value: entityState.STUDENT_NAME},
                    {label: 'Дата рождения', value: entityState.STUDENT_BIRTHDAY},
                    {label: 'Телефон', value: entityState.STUDENT_PHONE},
                    {label: 'E-mail', value: entityState.STUDENT_EMAIL},
                  ]"
                />

                <ui-admin-data-card
                    title="Образование"
                    :fields="[
                    {label: 'Школа', value: entityState.STUDENT_SCHOOL},
                    {label: 'Текущий класс', value: entityState.STUDENT_CLASS},
                  ]"
                />

              </div>

            </div>

            <div class="col-24 col-md-12">

              <div class="q-gutter-y-md">

                <div class="s-info-section">

                  <div class="__header">
                    <div class="__title">Курсы договора</div>
                  </div>

                  <q-markup-table
                      class="s-table-data"
                      flat
                      v-if="coursesGroups && coursesGroups.length"
                  >
                    <thead>
                    <tr class="text-left">
                      <th class="dense">Предмет</th>
                      <th class="dense">Преподаватель</th>
                      <th class="dense">Период</th>
                      <th class="dense text-right">Стоимость</th>
                      <th class="dense text-right"></th>
                    </tr>
                    </thead>
                    <tbody>

                    <template
                        v-for="coursesGroup in coursesGroups"
                    >
                      <tr
                          class="__item"
                      >
                        <td class="__item__name dense" colspan="5">
                          <b>Группа {{ coursesGroup.NAME }}</b>
                        </td>
                      </tr>
                      <tr
                          class="__item"
                          v-for="course in coursesGroup.COURSES"
                          :key="course.ID"
                      >
                        <td class="__item__name dense">
                          {{ course.SUBJECT_ELEMENT.NAME }}
                        </td>
                        <td class="__item__name dense">
                          {{ course.TEACHER_ELEMENT.NAME }}
                        </td>
                        <td class="__item__name dense">

                          {{ $util.date.timestampToFormat(course.PERIOD_FROM, 'DD.MM.YYYY') }} -
                          {{ $util.date.timestampToFormat(course.PERIOD_TO, 'DD.MM.YYYY') }}

                        </td>
                        <td class="__item__name dense">
                          {{ course.PRICE }}
                        </td>
                        <td class="__item__name dense">
                          <q-btn
                              :icon="$icons.trush"
                              dense
                              outline
                              size="sm"
                              @click="contractCourseDelete(course)"
                          />
                        </td>
                      </tr>
                    </template>

                    </tbody>
                  </q-markup-table>

                  <ui-btn-add
                      v-else
                      label="выбрать курсы"
                      @click="onContractCourseAdd"
                  />

                </div>

              </div>

            </div>

          </div>
        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="edit">

          <div class="row q-col-gutter-lg ">

            <div class="col-md-12">

              <div class="q-gutter-y-md">

                <ui-admin-data-card class="col-md-12" title="Заказчик">
                  <div class="row q-col-gutter-md">

                    <div class="col-24 col-md-16">
                      <q-input
                          label="ФИО заказчика"
                          outlined
                          v-model="entityState.BUYER_NAME"
                      />
                    </div>

                    <div class="col-24 col-md-8">
                      <q-input
                          label="Дата рождения"
                          outlined
                          v-model="entityState.BUYER_BIRTHDAY"
                      />
                    </div>

                    <div class="col-24 col-md-12">
                      <q-input
                          label="Телефон"
                          outlined
                          v-model="entityState.BUYER_PHONE"
                      />
                    </div>

                    <div class="col-24 col-md-12">
                      <q-input
                          label="E-mail"
                          outlined
                          v-model="entityState.BUYER_EMAIL"
                      />
                    </div>


                  </div>
                </ui-admin-data-card>

                <ui-admin-data-card class="col-md-12" title="Обучающийся">
                  <div class="row q-col-gutter-md">

                    <div class="col-24 col-md-16">
                      <q-input
                          label="ФИО обучающегося"
                          outlined
                          v-model="entityState.STUDENT_NAME"
                      />
                    </div>

                    <div class="col-24 col-md-8">
                      <q-input
                          label="Дата рождения"
                          outlined
                          v-model="entityState.STUDENT_BIRTHDAY"
                      />
                    </div>

                    <div class="col-24 col-md-12">
                      <q-input
                          label="Телефон"
                          outlined
                          v-model="entityState.STUDENT_PHONE"
                      />
                    </div>

                    <div class="col-24 col-md-12">
                      <q-input
                          label="E-mail"
                          outlined
                          v-model="entityState.STUDENT_EMAIL"
                      />
                    </div>

                  </div>
                </ui-admin-data-card>

                <ui-admin-data-card class="col-md-12" title="Образование">
                  <div class="row q-col-gutter-md">

                    <div class="col-24 col-md-16">
                      <q-input
                          label="Школа обучающегося"
                          outlined
                          v-model="entityState.STUDENT_SCHOOL"
                      />
                    </div>

                    <div class="col-24 col-md-8">

                      <q-select
                          label="Текущий класс обучения"
                          outlined
                          v-model="entityState.STUDENT_CLASS"
                          emit-value
                          map-options
                          :options="[
                {label: '9', value: 9},
                {label: '10', value: 10},
                {label: '11', value: 11},
              ]"
                      />

                    </div>


                  </div>
                </ui-admin-data-card>

              </div>

            </div>

            <div class="col-md-12">

              <div class="q-gutter-y-md">

                <ui-admin-data-card class="col-md-12" title="Договор">
                  <div class="row q-col-gutter-md">
                    <div class="col-24 col-md-16">
                      <q-input
                          label="Номер"
                          outlined
                          v-model="entityState.NUMBER"
                      />
                    </div>
                  </div>
                </ui-admin-data-card>

              </div>

            </div>

          </div>
        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="payments">

          <q-markup-table
              class="s-table-data"
              flat
              v-if="entity.ORDER_ITEMS && entity.ORDER_ITEMS.length"
          >
            <thead>
            <tr class="text-left">
              <th class="dense">№ заказа</th>
              <th class="dense">Дата создания</th>
              <th class="dense">Сумма</th>
              <th class="dense text-right">Статус</th>
              <th class="dense text-right"></th>
            </tr>
            </thead>
            <tbody>

            <template
                v-for="item in entity.ORDER_ITEMS"
            >
              <tr
                  class="__item"
                  v-if="item.ORDER"
              >
                <td class="__item__name dense">
                  {{ item.ORDER_ID }}
                </td>
                <td class="__item__name dense">
                  {{ item.ORDER.DATE_INSERT }}
                </td>
                <td class="__item__name dense">
                  {{ item.FINAL_PRICE }} руб.
                </td>
                <td class="__item__name dense">

                  <span v-if="item.ORDER.IS_PAID" class="bg-green-4 q-pa-xs text-white">
                    оплачен {{ item.ORDER.DATE_PAYED }}
                  </span>
                  <span v-else>
                    не оплачен
                  </span>

                </td>
                <td class="__item__name dense">

                </td>
              </tr>
            </template>

            </tbody>
          </q-markup-table>

        </q-tab-panel>

      </q-tab-panels>


    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {

  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {},
  data() {
    return {
      modeId: 'common',
      dialogIs: 'ui-admin-dialog',
      entityState: null,

      termsEduGroups: [],
      termsSubject: [],
      termsTeacher: [],

      files: {
        doc: null
      }
    }
  },
  computed: {

    modes() {
      return [
        {
          id: 'common',
          label: 'Общее',
          type: 'tab',
          actions: () => {

          }
        },
        {
          id: 'edit',
          label: 'Правка',
          type: 'tab',
          actions: () => {
            return [
              {
                label: 'Сохранить',
                color: 'primary',
                callback: this.onSubmit
              }
            ]
          }
        },
        {
          id: 'payments',
          label: 'Платежи',
          type: 'tab',
          actions: () => {
            return []
          }
        },
        {
          id: 'docs',
          label: 'Документы',
          type: 'tab',
          actions: () => {
            return []
          }
        }
      ]
    },

    courses() {
      return this.entityState && this.entityState.COURSES || []
    },

    coursesGroups() {

      return Object.values(this.courses.reduce((map, row) => {
        if (!map[row.EDU_GROUP]) {
          map[row.EDU_GROUP] = {
            ...row.EDU_GROUP_ELEMENT,
            COURSES: []
          }
        }
        map[row.EDU_GROUP].COURSES.push(row)
        return map
      }, {}))
    },
    actions() {
      return this.mode && this.mode.actions && this.mode.actions() || []
    },
  },
  async created() {
    await this.fetch()
  },

  methods: {

    onUpdate(v) {
      console.log(v)
    },
    async onContractCourseAdd() {

      this.$store.dispatch('router/vrouterPush', {
        is: 'course-selector',
        props: {
          entityId: this.contract.ID,
          onResolve: async () => {
            await this.$store.dispatch('scopesRefetch', ['user'], {root: true})
          }
        }
      }, {root: true})

    },

    async contractCourseDelete(course) {

      this.$q.dialog({
        title: 'Подтвердить удаление',
        message: 'Удалить курс из договора?',
        cancel: true,
      }).onOk(async () => {

        try {

          const res = await this.mutationMethod(async () => {
            return await this.$store.dispatch('schooler/userContractCourseDelete', {
              contractId: this.contract.ID,
              courseId: course.ID
            })
          })

          await this.$store.dispatch('scopesRefetch', ['user'])

        } catch (e) {

          console.log(e)

        }
      })

    },

    async onSubmitCommit() {

      try {
        const entity = this.entityForSave(this.entityState)

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
            }
        )

        if (this.onResolve)
          this.onResolve()

        this.visible = false

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
        ...entity,
        PERIOD_FROM: this.$util.date.timestampToFormat(entity.PERIOD_FROM, 'date'),
        PERIOD_TO: this.$util.date.timestampToFormat(entity.PERIOD_TO, 'date'),
      }
    },

    entityForSave(entity) {

      return {
        ...entity,
        PERIOD_FROM: this.$util.date.parseTime(entity.PERIOD_FROM, 'date', 'ts'),
        PERIOD_TO: this.$util.date.parseTime(entity.PERIOD_TO, 'date', 'ts'),
      }
    },

    async fetch(refetch) {

      await this.fetchingMethod(async () => {

        if (this.action === 'edit') {
          const {data: {res}} = await this.$apollo.query({
            query: require('../gql/query/single.gql'),
            fetchPolicy: 'no-cache',
            variables: {
              id: parseInt(this.entityId)
            }
          })

          this.entity = res
          this.entityState = this.entityForEdit(res)
        } else {
          this.entity = {
            NAME: null,
            COURSES: []
          }
          this.entityState = this.entityForEdit(this.entity)
        }

      })
    },

  },
  watch: {

    async 'files.doc'(file) {
      if (file) {

        try {
          const fileDoc = await this.fileUpload({
            handler: 'school.contract',
            field: 'DOC',
            entityId: parseInt(this.entityId),
            file: file
          })

          if (fileDoc) {
            this.entityState.DOC = fileDoc
          }

        } catch (e) {

        }

      }
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
