<template>

  <ui-dialog
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :loading="fetching"
    :title="pageTitle"
    dialogWidth="710px"
    @hide="onHide"
  >


    <q-form
      ref="form"
      class="s-form-section-controls"
    >

      <div v-if="model.spec_name" class="q-mb-sm text-grey-7 s-font-lg">
        {{ model.spec_name }}
      </div>

      <div class="q-gutter-y-md q-mt-md">

        <div class="row">

          <div class="col-md-6 text-weight-bold q-pr-md">
            Форма:
          </div>

          <div class="col-md-18">
            {{ model.fob.name }}
          </div>

        </div>

        <div class="row q-col-gutter-y-sm">

          <div class="col-24 col-lg-6 text-weight-bold">
            Вступительные испытания:
          </div>

          <div class="col-24 col-lg-18">

            <div class="q-gutter-y-sm">

              <q-markup-table class="c-competitions">
                <tbody>
                <tr v-for="(item, index) of subjectsRequired" :key="index" class="col-12">
                  <td>
                    {{ $store.getters['edu_subject/byId'][item.csubject].name }}
                  </td>
                  <td class="text-right">
                    мин. балл {{ item.minimal }}
                  </td>
                </tr>
                </tbody>
              </q-markup-table>

            </div>

          </div>

        </div>

        <div v-if="subjectsOptional.length" class="row q-col-gutter-y-sm">

          <div class="col-24 col-lg-6 text-weight-bold">
            по выбору:
          </div>

          <div class="col-24 col-lg-18">

            <div class="q-gutter-y-sm">

              <q-markup-table class="c-competitions">
                <tbody>
                <tr v-for="(item, index) of subjectsOptional" :key="index" class="col-12">
                  <td>
                    {{ $store.getters['edu_subject/byId'][item.csubject].name }}
                  </td>
                  <td class="text-right">
                    мин. балл {{ item.minimal }}
                  </td>
                </tr>
                </tbody>
              </q-markup-table>

            </div>

          </div>

        </div>

        <div class="row q-col-gutter-y-sm">

          <div class="col-24 col-lg-6 text-weight-bold">
            Конкурсы:
          </div>

          <div class="col-24 col-lg-18">

            <div class="q-gutter-y-sm">

              <div v-if="admissionSpecs && admissionSpecs.length > 1" class="q-mb-md">

                <q-select
                  v-model="specs"
                  :options="admissionSpecs"
                  :rules="[val => !!val.length || 'Обязательное поле']"
                  class="c-specs"
                  dense
                  emit-value
                  hint="укажите до 3-х специальностей"
                  label="Выберите специальности"
                  lazy-rules
                  map-options
                  max-values="3"
                  multiple
                  option-label="name"
                  option-value="id"
                  outlined
                  popup-content-class="s-limit-popup-width"
                  reactive-rules
                  stack-label
                  use-chips
                />

              </div>

              <q-markup-table class="c-competitions">

                <tbody>
                <tr v-for="(item, index) of model.competitions" :key="index" class="col-12">
                  <td class="" style="white-space:normal;">

                    <div>{{ item.source.name }}</div>

                    <div v-if="$q.screen.lt.md" class="q-mt-xs text-grey-6">
                      {{ item.admissionNumber }} мест
                    </div>

                  </td>
                  <td v-if="$q.screen.gt.sm">
                    <div class="flex">
                      {{ item.admissionNumber }} мест
                    </div>
                  </td>
                  <td class="text-right">
                    <q-btn
                      color="primary"
                      dense
                      label="подать заявление"
                      unelevated
                      @click="onAdd(item)"
                    />
                  </td>
                </tr>
                </tbody>
              </q-markup-table>


            </div>

          </div>

        </div>

      </div>


      <br/>

    </q-form>

  </ui-dialog>

</template>

<script>

import MVRoute from '@common/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  components: {},
  props: {
    model: {},
    onSelect: {}
  },
  data() {
    return {
      modelData: this.$util.base.cloneDeep(this.model),
      proc: false,
      status: '',
      specs: [],

    }
  },
  computed: {

    admissionSpecs() {

      if (this.model.clevel !== 3) return []

      if ([23587, 23546, 23599].indexOf(this.model.id) > -1) return []

      return this.$store.getters['edu_order/availableAdmissions'].filter((program) => {

        if (
          program.cdirection === this.model.cdirection &&
          program.cfob === this.model.cfob &&
          program.cfac === this.model.cfac &&
          program.clevel === this.model.clevel &&
          (
            (program.id !== this.model.id) && ((program.budgCount + program.comercCount) <= 0)
            ||
            (program.id === this.model.id) && this.model.spec_name && (program.budgCount > 0 || program.comercCount > 0)
          )
        ) {
          return true
        }

        return false
      }).map((item) => ({
        ...item,
        name: item.abbr + ' ' + item.spec_name
      }))
    },

    admissionName() {
      return this.model.direction.cod + ' ' + this.model.abbr + ' ' + this.model.direct_name
    },

    subjectsRequired() {

      return this.model.subjects.filter(item => {
        return !this.subjectsOptional.find(oitem => oitem.csubject === item.csubject)
      })
    },

    subjectsOptional() {

      const byNumber = this.model.subjects.reduce((map, obj) => {
        if (!map[obj.number])
          map[obj.number] = []

        map[obj.number].push(obj)

        return map
      }, {})

      const res = []

      Object.values(byNumber).forEach((items) => {
        if (items.length > 1) {
          Array.prototype.push.apply(res, items)
        }
      })

      return res
    },

    typeOptions() {
      return this.$store.getters['edu_quotaType/items'].filter(
        (term) => this.modelData.quotaType === term.id || !this.items.find((item) => item.quotaType === term.id)
      )
    },

    pageTitle() {
      return this.admissionName
    },

    actions() {
      return []
    },

    subjectsOptions() {

      return this.$store.getters['edu_subject/egeItemsOptions'].filter(
        (term) =>
          this.modelData.subject === term.id || !this.items.find((item) => item.subject === term.id)
      )
    }
  },
  methods: {

    async onAdd(competition) {
      this.onSelect(competition)
    },

  }
}
</script>
<style lang="scss" scoped>

.c-orders {
  border: 1px solid #EFEEEE;

  .c-orders__order:not(:last-child) {
    border-bottom: 1px solid #EFEEEE;
  }
}

.c-competitions {
  td, th {
    font-size: 15px;
  }
}

.c-specs {
  /deep/ {
    .q-chip {
      height: auto !important;

      .ellipsis {
        white-space: normal;
      }
    }
  }
}

</style>
