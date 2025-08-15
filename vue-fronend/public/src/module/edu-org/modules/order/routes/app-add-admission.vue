<template>

  <ui-dialog
      v-model="visible"
      :actions="actions"
      :actionsClose="true"
      :loading="fetching"
      :title="pageTitle"
      dialogWidth="900px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >

    <q-form
        ref="form"
    >
      <div class="q-gutter-y-sm q-mt-md">
        <div class="row">
          <div class="col-auto text-weight-bold q-pr-md">
            Специальность:
          </div>
          <div class="col-auto">
            <div v-if="model.spec_name && (!model.specs || model.specs.length <= 1)" class="q-mb-sm text-grey-7 s-font-lg">
              {{ model.spec_name }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-auto text-weight-bold q-pr-md">
            Форма:
          </div>
          <div class="col-auto">
            {{ model.fob.name }}
          </div>
        </div>
      </div>

      <div class="q-gutter-y-md q-mt-md">


        <div class="row q-col-gutter-y-sm">

          <div class="col-24 text-weight-bold">
            Вступительные испытания:
          </div>

          <div class="col-24">

            <div class="q-gutter-y-sm">


              <q-markup-table
                  class="c-subjects"
              >
                <tbody>
                <template
                    v-for="(subjects, priority) of subjectsTree"
                >
                  <tr
                      v-for="(subject, index) of subjects"
                      :key="subject.csubject"
                  >
                    <td v-if="index===0" :rowspan="subjects.length">
                      № {{ priority }}
                    </td>
                    <td style="white-space: normal;">
                      {{ $store.getters['edu_subject/byId'][subject.csubject].name }}
                      <div v-if="subject.csubject>=40" class="q-mt-sm text-grey-6" style="font-size: 12px;">ВИ на базе
                        СПО
                      </div>
                    </td>
                    <td class="text-right">
                      мин. балл {{ subject.minimal }}
                    </td>
                    <td v-if="index===0" :rowspan="subjects.length" style="white-space: normal;">
                      <template v-if="subjects.length>1">
                        по выбору
                      </template>
                    </td>
                  </tr>
                </template>

                </tbody>
              </q-markup-table>

            </div>

          </div>

        </div>


        <div v-if="model.specs && model.specs.length > 1" class="row q-col-gutter-y-sm">

          <div class="col-24 text-weight-bold">
            Специальности:
          </div>

          <div class="col-24">

            <div class="q-gutter-y-sm">

              <div class="q-mb-md">

                <div v-for="(specId, specIndex) of specs" :key="specIndex" class="q-mb-sm">

                  <q-select
                      v-model="specs[specIndex]"
                      :label="(specIndex + 1) + ' приоритет'"
                      :options="model.specs"
                      class="c-specs"
                      dense
                      emit-value
                      lazy-rules
                      map-options
                      option-label="name"
                      option-value="id"
                      outlined
                      popup-content-class="s-limit-popup-width"
                      reactive-rules
                      stack-label
                      use-chips
                      @clear="onSpecsUpdated"
                      @input="onSpecsUpdated"
                  />

                </div>

                <q-btn
                    v-if="specs.length < model.specs.length"
                    color="primary"
                    label="добавить специальность"
                    outline
                    size="14px"
                    @click="specs.push(null)"
                />

              </div>


            </div>

          </div>

        </div>

        <div class="row q-col-gutter-y-sm">

          <div class="col-24 text-weight-bold">
            Конкурсы:
          </div>

          <div class="col-24">

            <div class="q-gutter-y-sm">

              <q-markup-table class="c-competitions s-table">

                <thead>
                  <tr>
                    <th width="35%">Конкурс</th>
                    <th width="30%">Организация</th>
                    <th>Мест</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>

                <tr v-for="(item, index) of competitions" :key="index" class="col-12">

                  <td class="" style="white-space:normal;">

                    <div>{{ item.source.name }}</div>

                  </td>
                  <td>
                    <div v-if="item.celevOrgName" class="q-mt-sm " style=" font-size: 12px;">
                      {{ item.celevOrgName }}
                    </div>
                  </td>
                  <td>
                    {{ item.admissionNumber }}
                  </td>
                  <td class="text-right">
                    <q-btn
                        color="primary"
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

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  components: {},
  props: {
    model: {},
    onSaved: {}
  },
  data() {
    return {
      modelData: this.$util.base.cloneDeep(this.model),
      proc: false,
      status: '',
      specs: [
        null
      ]
    }
  },
  computed: {

    competitions() {
      return [...this.model.competitionsList].sort((a,b) => {
        return a.csource - b.csource
      })
    },

    admissionName() {
      return this.model.direction.cod + ' ' + this.model.abbr + ' ' + this.model.direct_name
    },

    subjectsRequired() {

      return this.model.subjects.filter(item => {
        return !this.subjectsOptional.find(oitem => oitem.csubject === item.csubject)
      })
    },

    subjectsTree() {
      return this.model.subjects.reduce((map, obj) => {
        if (!map[obj.number])
          map[obj.number] = []
        map[obj.number].push(obj)
        return map
      }, {})
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

    async onAddCommit(competition) {

      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('~module/edu-org/modules/order/gql/order/mutation/application_add.gql'),
          variables: {
            competitionId: competition._id,
          }
        })
        if (res.result.success) {
          await this.$store.dispatch('edu_order/userOrderFetch')
        }
      } catch (e) {
        console.log(e)
      }
    },

    async onAdd(competition) {
      if (await this.$refs.form.validate()) {
        await this.onAddCommit(competition)
      }
    },

    onSpecsUpdated() {

      return;

      this.specs = this.specs.filter(item => !!item)

      if (!this.specs.length) {
        this.specs = [null]
      }
    }
  },
  watch: {}
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

.c-subjects {
  td, th {
    border: 1px solid #dddddd;
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
