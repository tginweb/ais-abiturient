<template>

  <div>

    <q-form ref="form" class="q-mb-lg">

      <template v-if="order.eduTypeSlug=='bak' || order.eduTypeSlug=='mag'">

        <div class="com s-info-section " v-if="false">

          <h6 class="q-mb-md q-mt-none">Целевое направление</h6>

          <div class="row q-col-gutter-sm">

            <div class="col-24 q-mb-md">

              <q-checkbox v-model="dataEntrance.targetHave" label="Имею направление от целевой организации"></q-checkbox>

            </div>

            <div v-if="dataEntrance.targetHave" class="col-12 q-mb-sm">

              <q-input v-model="dataEntrance.targetOrganization" label="Наименование организации" outlined></q-input>

            </div>

            <div v-if="dataEntrance.targetHave" class="col-12 q-mb-sm">

              <q-input v-model="dataEntrance.targetDogovor" label="Номер договора" outlined></q-input>

            </div>

          </div>

        </div>

      </template>

      <div class="com s-info-section" v-if="order.eduTypeSlug==='spo' || order.eduTypeSlug==='bak'">

        <h6 class="q-mb-md q-mt-none">Испытания</h6>

        <template v-if="order.eduTypeSlug==='spo'">

          <q-markup-table
              v-if="itemsState.length"
              class="c-subjects s-table q-mb-md"
              flat
          >
            <thead>
            <tr class="text-left">
              <th class="dense">Предмет</th>
              <th>Укажите балл</th>
            </tr>
            </thead>
            <tbody>

            <tr
                v-for="item in itemsState"
                :key="item.id"
                class="__item"
            >
              <td class="__item__label dense">
                <ui-input-select
                    v-model="item.csubject"
                    :options="subjectOptions"
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
                <q-input
                    v-if="item.abitPassingType==='gia' || item.passingType==='gia'"
                    v-model="item.abitEgeBall"
                    dense
                    outlined
                    placeholder="укажите балл"
                    size="16"
                    :readonly="!item.id ? false : !item.canEditAbit"
                />
              </td>
            </tr>
            </tbody>

          </q-markup-table>
          <div v-else>
            не внесены вступительные испытания ЕГЭ
          </div>

        </template>

        <template v-else-if="order.eduTypeSlug==='bak'">

          <div class="q-gutter-x-md flex q-pb-lg">

            <q-btn
                color="primary"
                icon="fas fa-plus"
                label="добавить предмет ЕГЭ"
                size="md"
                @click="onAddTest"
            />

            <q-space/>

          </div>

          <q-markup-table
              v-if="itemsState.length"
              class="c-subjects s-table q-mb-md"
              flat
          >
            <thead>
            <tr class="text-left">
              <th class="dense">Предмет</th>
              <th>Способ сдачи</th>
              <th width="10%">Год сдачи ЕГЭ</th>
              <th>Укажите Балл ЕГЭ</th>
              <th>Проверенный Балл ЕГЭ</th>
              <th></th>
            </tr>
            </thead>
            <tbody>

            <tr
                v-for="item in itemsState"
                :key="item.id"
                class="__item"
            >
              <td class="__item__label dense">
                <ui-input-select
                    v-model="item.csubject"
                    :options="subjectOptions"
                    :readonly="!!item.id"
                    :required="true"
                    dense
                    emit-value
                    map-options
                    option-label="name"
                    option-value="id"
                    outlined
                    @input="changed = true"
                    :rules="[val => !!val || 'Обязательное поле']"
                />
              </td>
              <td class="__item__label dense">

                <q-select
                    v-model="item.abitPassingType"
                    :options="[
                        {value: 'ege', label: 'ЕГЭ'},
                        {value: 'internal', label: 'собираюсь сдавать в ИРНИТУ'},
                    ]"
                    :required="true"
                    dense
                    emit-value
                    map-options
                    option-label="label"
                    option-value="value"
                    outlined
                    @input="changed = true"
                    :rules="[val => !!val || 'Обязательное поле']"
                    :readonly="!item.id ? false : !item.canEditAbit"
                />
              </td>
              <td class="__item__result">
                <q-select
                    v-if="item.abitPassingType==='ege'"
                    v-model="item.abitEgeYear"
                    :options="[
                        {value: '2023', label: '2023'},
                        {value: '2022', label: '2022'},
                        {value: '2021', label: '2021'},
                        {value: '2020', label: '2020'},
                        {value: '2019', label: '2019'},
                    ]"
                    :required="true"
                    dense
                    emit-value
                    map-options
                    option-label="label"
                    option-value="value"
                    outlined
                    style="max-width: 100px"
                    :readonly="!item.id ? false : !item.canEditAbit"
                    @input="changed = true"
                    :rules="[val => !!val || 'Обязательное поле']"
                />
              </td>
              <td class="__item__result">
                <q-input
                    v-if="item.abitPassingType==='ege'"
                    v-model="item.abitEgeBall"
                    dense
                    outlined
                    placeholder="укажите балл"
                    size="16"
                    :readonly="!item.id ? false : !item.canEditAbit"
                    type="number"
                />
              </td>
              <td class="__item__status">
               <span class="s-font-xxl">
                    {{ item.resultBall }}
               </span>
              </td>

              <td>
                <q-btn
                    v-if="!item.id || item.canDeleteAbit"
                    color="primary"
                    label="удалить"
                    outline
                    @click="onDelete(item)"
                />
              </td>
            </tr>
            </tbody>

          </q-markup-table>
          <div v-else>
            не внесены вступительные испытания ЕГЭ
          </div>

        </template>

      </div>

      <div class="com s-info-section ">

        <h6 class="q-mb-md q-mt-none">Достижения</h6>

        <div class="q-gutter-x-md flex q-pb-lg">

          <q-btn
              color="primary"
              icon="fas fa-plus"
              label="добавить идивидуальное достижение"
              size="md"
              @click="onAddAchievement"
          />

          <q-space/>

        </div>

        <q-markup-table
            v-if="achievementsState.length"
            class="c-subjects s-table q-mb-md"
            flat
        >
          <thead>
          <tr class="text-left">
            <th>Категория ИД</th>
            <th>Документ</th>
            <th></th>
          </tr>
          </thead>
          <tbody>

          <tr
              v-for="item in achievementsState"
              :key="item.id"
              class="__item"
          >
            <td class="__item__label dense">
              <span
                  class="s-font-md s-link cursor-pointer"
                  @click="onAddAchievementEdit(item)"
              >{{ item.type.name }}</span>
            </td>
            <td class="__item__label dense">
              {{ item.doc.docTypeName }}
            </td>
            <td>
              <div class="q-gutter-x-md">
                <q-btn
                    v-if="item.abitCanEdit"
                    color="primary"
                    label="редактировать"
                    outline
                    @click="onAddAchievementEdit(item)"
                />
                <q-btn
                    v-if="item.abitCanDelete"
                    color="red"
                    label="удалить"
                    outline
                    @click="onAddAchievementDelete(item)"
                />
              </div>
            </td>
          </tr>
          </tbody>

        </q-markup-table>
        <div v-else>
          не внесены ИД
        </div>

      </div>

    </q-form>

    <q-btn
        class="s-font-lg q-mt-lg"
        color="primary"
        icon="fas fa-arrow-right"
        label="Перейти к выбору заявлений"
        rounded
        @click="onNext"
    />

  </div>

</template>

<script>


import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep";

export default {
  props: {
    order: {}
  },
  components: {},
  data() {
    return {
      itemsState: cloneDeep(this.order.tests),
      achievementsState: cloneDeep(this.order.achievements),
      changed: false
    }
  },
  computed: {
    dataEntrance() {
      return this.order.anket.entrance
    },
    subjectOptions() {
      if (this.order.eduTypeSlug==='spo') {
        return this.$store.state.edu_subject.app.items.filter(item => [27].indexOf(item.id) > -1)
      } else if (this.order.eduTypeSlug==='bak') {
        return this.$store.state.edu_subject.app.items.filter(item => item.isEge)
      }
    },

    usedSubjectIds() {
      return this.itemsState.reduce((map, item) => {
        map[item.csubject] = item.csubject
        return map
      }, {})
    },

  },
  created() {

  },
  methods: {

    async onNext() {
      if (await this.$refs.form.validate()) {

        this.onSave()
        this.$router.push('/cab/order/step/applications')
      }
    },

    onAddAchievementEdit(item) {
      this.$router.push({
        name: 'edu.order:achievement-edit',
        params: {
          entityId: item.id,
          order: this.order,
          model: item
        }
      })
    },
    onAddAchievementDelete(item) {

    },
    onDelete(item) {
      if (!item.id)
        this.itemsState = this.itemsState.filter(test => test !== item)
    },
    onReset() {
      this.unsetChanged()
      this.itemsState = cloneDeep(this.items)
    },
    unsetChanged() {

    },
    async onSaveCommit() {

      const data = this.itemsState.map(item => ({
        isNew: item.isNew,
        id: item.id,
        _id: item._id,
        nid: item.nid,
        csubject: item.csubject,
        abitPassingType: item.abitPassingType,
        abitEgeBall: item.abitEgeBall,
      }))

      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('~module/edu-org/modules/order/gql/order/mutation/tests_save.gql'),
          variables: {
            data: data
          }
        })
        if (res.result.success) {
          this.unsetChanged()
        }
        return true
      } catch (e) {
        console.log(e)
      }

      return false
    },
    async reload() {

    },
    async onSave() {
      if (await this.$refs.form.validate())
        await this.onSaveCommit()
    },
    onAddTest() {
      this.itemsState.push({
        isNew: true,
        csubject: null
      })
      this.changed = true
    },
    onAddAchievement() {

      this.$router.push({
        name: 'edu.order:achievement-create',
        params: {
          order: this.order,
          model: {}
        }
      })
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

.c-applications {

  .__item {
    border: 2px solid $primary;
    border-radius: 20px;

  }

  .__item__title {
    font-weight: 600;
  }
}

.fname {
  width1: 135px;
}

</style>
