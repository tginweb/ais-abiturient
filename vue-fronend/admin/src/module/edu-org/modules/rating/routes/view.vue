<template>

  <component
      v-model="visible"
      :title="title"
      dialogWidth="1250px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
  >
    <template v-if="entityState" v-slot:default>

      <div class="row q-mb-lg q-col-gutter-lg">
        <div class="col-12">
          <ui-admin-data-card
              :fields="fieldsPrimary"
          />
        </div>
        <div class="col-12">
          <ui-admin-data-card
              :fields="fieldsSecondary"
              fieldLabelWidth="200px"
          />
        </div>
      </div>

      <q-form ref="form">

        <div v-if="actionState === 'edit'">
          <div v-if="entity.generated">
            <div class="q-mb-md q-mt-md">
              <div class="row q-col-gutter-lg">
                <div class="col-md-12">
                  <ui-input-select
                      v-model="cadmission"
                      :emit-value="true"
                      :map-options="true"
                      :options="$store.state.edu_admission.app.admissions"
                      clearable
                      label="Набор"
                      option-label="abbr"
                      option-value="id"
                      outlined
                  />
                </div>
                <div class="col-md-12">
                  <ui-input-select
                      v-model="compareRatingId"
                      :emit-value="true"
                      :map-options="true"
                      :options="compareRatingOptions"
                      clearable
                      label="Сравнить с"
                      option-label="name"
                      option-value="id"
                      outlined
                  />
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-md-4">
                <ul class="q-pl-sm" style="position: sticky; top:0">
                  <li
                      v-for="compet in competitionsCurrent"
                      :key="compet.id"
                      style="margin-bottom: 7px;"
                  >
                    <a href="#" @click.stop.prevent="onNavCompetition(compet)">
                      {{ compet.name }}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-md-20">
                <div
                    v-for="compet in competitionsCurrent"
                    :key="compet.id"
                    :ref="'compet-' + compet.id"
                    class="q-mb-lg"
                >
                  <div class="s-font-xl text-bold q-mb-md">
                    {{ compet.name }}
                  </div>
                  <div>

                    <template v-if="!compareRating">
                      <q-markup-table
                          ref="table"
                          bordered
                          class="text-center s-table"
                      >
                        <thead>
                        <tr>
                          <th>№</th>
                          <th>ФИО</th>
                          <th>ИД как видят в списках</th>
                          <th>ВИ</th>
                          <th>БАЛЛ ИД</th>
                          <th>БАЛЛ</th>
                          <th>ПРИОР</th>
                          <th>ПОДЛ</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="(item,index) of compet.ratingApps"
                            class="cursor-pointer"
                            @click="$router.push('/admin/edu/order/'+item.orderId+'/view').catch(()=>{})"
                        >
                          <td>
                            {{ index + 1 }}
                          </td>

                          <td>
                            {{ item.fio }}
                          </td>

                          <td>
                            <span style="white-space: nowrap;">{{ item.ratingId }}</span>
                          </td>

                          <td>
                            <ul class="q-pl-sm q-mt-none">
                              <li v-for="test of item.currentApp.tests" style="white-space: nowrap;">
                                {{ test.subjectName }} - {{ test.ball }}
                              </li>
                            </ul>
                          </td>
                          <td>
                            <div v-if="item.achievementBall" class="s-font-lg">
                              {{ item.currentApp.achievementBall }}
                            </div>
                          </td>
                          <td style="text-align: center;">
                            <div
                                class="s-font-xl q-pa-sm"
                                style="display: inline-block; border: 1px solid #555; border-radius: 10px;"
                            >
                              {{ item.currentApp.ball }}
                            </div>
                          </td>
                          <td>
                            <div class="s-font-xl">
                              № {{ item.currentApp.priority }}
                            </div>
                          </td>
                          <td
                              :class="{
                              'bg-green-5 text-white': item.currentApp.podldoc
                            }"
                          >
                            <div class="s-font-lg">
                              {{ item.currentApp.podldoc ? 'ДА' : '' }}
                            </div>
                          </td>
                        </tr>
                        </tbody>
                      </q-markup-table>
                    </template>
                    <template v-else>
                      <div
                          ref="table"
                          class="text-center s-table bordered"
                      >
                        <table>
                          <thead>
                          <tr>
                            <th></th>
                            <th>Абитуриент</th>
                            <th colspan="5" style="text-align: center" class="">Текущий</th>
                            <th></th>
                            <th colspan="5" style="text-align: center">Сравнение</th>
                          </tr>
                          <tr>
                            <th></th>
                            <th></th>

                            <th>Вступительные испытания</th>
                            <th>Индивидуальые достижения</th>
                            <th>Суммарный балл</th>
                            <th>Приоритет</th>
                            <th>Подлинник</th>

                            <th></th>

                            <th>Вступительные испытания</th>
                            <th>Индивидуальые достижения</th>
                            <th>Суммарный балл</th>
                            <th>Приоритет</th>
                            <th>Подлинник</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                              v-for="(item,index) of compet.ratingApps"
                              class="cursor-pointer"
                              @click="$router.push('/admin/edu/order/'+item.orderId+'/view')"
                          >
                            <td>
                              {{ index + 1 }}
                            </td>

                            <td>
                              {{ item.fio }}
                            </td>

                            <template v-if="item.currentApp">
                              <td>
                                <ul class="q-pl-sm q-mt-none">
                                  <li v-for="test of item.currentApp.tests" style="white-space: nowrap;">
                                    {{ test.subjectName }} - {{ test.ball }}
                                  </li>
                                </ul>
                              </td>
                              <td>
                                <div v-if="item.achievementBall" class="s-font-lg">
                                  {{ item.currentApp.achievementBall }}
                                </div>
                              </td>
                              <td style="text-align: center;">
                                <div
                                    class="s-font-xl q-pa-sm"
                                    style="display: inline-block; border: 1px solid #555; border-radius: 10px;"
                                    :class="{
                                      's-changed': item.compareApp && (item.currentApp.ball !== item.compareApp.ball)
                                    }"
                                >
                                  {{ item.currentApp.ball }}
                                </div>
                              </td>
                              <td>
                                <div
                                    class="s-font-xl"
                                    :class="{
                                      's-changed': item.compareApp && (item.currentApp.priority !== item.compareApp.priority)
                                    }"
                                >
                                  № {{ item.currentApp.priority }}
                                </div>
                              </td>
                              <td
                                  :class="{
                                    'bg-green-5 text-white': item.currentApp.podldoc
                                  }"
                              >
                                <div class="s-font-lg">
                                  {{ item.currentApp.podldoc ? 'ДА' : '' }}
                                </div>
                              </td>
                            </template>
                            <td v-else colspan="5" class="bg-red-1" style="text-align: center;vertical-align: middle;">нет</td>

                            <td>
                              сравнение:
                            </td>

                            <template v-if="item.compareApp">
                              <td class="bg-grey-2">
                                <ul class="q-pl-sm q-mt-none">
                                  <li v-for="test of item.compareApp.tests" style="white-space: nowrap;">
                                    {{ test.subjectName }} - {{ test.ball }}
                                  </li>
                                </ul>
                              </td>
                              <td class="bg-grey-2">
                                <div v-if="item.compareApp.achievementBall" class="s-font-lg">
                                  {{ item.currentApp.achievementBall }}
                                </div>
                              </td>
                              <td style="text-align: center;" class="bg-grey-2">
                                <div
                                    class="s-font-xl q-pa-sm"
                                    style="display: inline-block; border: 1px solid #555; border-radius: 10px;"
                                    :class="{
                                      's-changed': item.currentApp && (item.currentApp.ball !== item.compareApp.ball)
                                    }"
                                >
                                  {{ item.compareApp.ball }}
                                </div>
                              </td>
                              <td class="bg-grey-2">
                                <div
                                    class="s-font-xl"
                                    :class="{
                                      's-changed': item.currentApp && (item.currentApp.priority !== item.compareApp.priority)
                                    }"
                                >
                                  № {{ item.compareApp.priority }}
                                </div>
                              </td>
                              <td
                                  :class="{
                                    'bg-grey-2': !item.compareApp.podldoc,
                                    'bg-green-5 text-white': item.compareApp.podldoc
                                  }"
                              >
                                <div class="s-font-lg">
                                  {{ item.compareApp.podldoc ? 'ДА' : '' }}
                                </div>
                              </td>
                            </template>
                            <td v-else colspan="5" class="bg-red-1" style="text-align: center;vertical-align: middle;">нет</td>


                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </template>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div v-else class="q-py-lg q-px-lg text-center text-red">
          Для генерации сначала сохраните
        </div>

      </q-form>
    </template>
  </component>
</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import generateQuery from "@tgin/main/graphql/lib/generate-query";

export default {
  mixins: [MVroute],
  props: {},
  components: {},
  apollo: {
    ratings: generateQuery('ratings', {
      query: require('../gql/query/list.gql'),
    }),
  },
  data() {
    return {
      entityIdState: this.entityId,
      cadmission: 24176,
      compareRatingId: null,
      compareRating: null,
      ratings: []
    }
  },
  computed: {
    compareRatingOptions() {
      return this.ratings.filter(item => item.id !== this.entityIdState)
    },

    fieldsPrimary() {
      const res = []

      res.push({
        label: 'ID',
        value: this.entity.nid,
      })

      res.push({
        label: 'Дата создания',
        value: this.$util.date.timestampToFormat(this.entity.createAt, 'DD MMMM HH:mm'),
      })

      return res
    },
    fieldsSecondary() {
      const res = []

      res.push({
        label: 'Начало генерации',
        value: this.$util.date.timestampToFormat(this.entity.generateStartAt, 'DD MMMM HH:mm'),
      })

      res.push({
        label: 'Окончание генерации',
        value: this.$util.date.timestampToFormat(this.entity.generateEndAt, 'DD MMMM HH:mm'),
      })

      res.push({
        label: 'Длительность генерации',
        value: this.entity.generateTime ? this.entity.generateTime + ' сек' : ''
      })

      return res
    },
    competitionsCurrent() {
      return this.competitionsByAdmission[this.cadmission] || []
    },
    competitionsByAdmission() {
      return this.competitions.reduce((map, item) => {
        if (!map[item.cadmission]) {
          map[item.cadmission] = []
        }
        map[item.cadmission].push(item)
        return map
      }, {})
    },
    competitions() {

      const competitions = []

      if (this.entity) {

        for (const competition of this.entity.competitions) {

          const competitionData = {
            ...competition,
            apps: {}
          }

          if (this.compareRating) {
            const compareCompetition = this.compareRating.competitions.find(item => item.name === competition.name)
            if (compareCompetition) {
              for (const app of compareCompetition.ratingApps) {
                if (!competitionData.apps[app.orderId]) {
                  competitionData.apps[app.orderId] = {
                    orderId: app.orderId,
                  }
                }
                competitionData.apps[app.orderId].compareApp = app
                competitionData.apps[app.orderId].ball = app.ball
                competitionData.apps[app.orderId].ratingId = app.ratingId
                competitionData.apps[app.orderId].fio = app.fio
              }
            }
          }

          for (const app of competition.ratingApps) {
            if (!competitionData.apps[app.orderId]) {
              competitionData.apps[app.orderId] = {
                orderId: app.orderId,
              }
            }
            competitionData.apps[app.orderId].currentApp = app
            competitionData.apps[app.orderId].ball = app.ball
            competitionData.apps[app.orderId].ratingId = app.ratingId
            competitionData.apps[app.orderId].fio = app.fio
          }

          competitionData.ratingApps = []

          for (let [orderId, item] of Object.entries(competitionData.apps)) {
            competitionData.ratingApps.push(item)
          }

          competitions.push(competitionData)
        }
      }

      return competitions
    },
    actions() {
      const res = []

      if (this.entity) {
        if (this.entity.generateAvailable) {
          res.push({
            label: 'Запустить генрерацию',
            callback: this.onStartGenerate
          })
        }
      }

      return res
    },
    title() {
      return 'Список ' + (this.actionState === 'edit' && this.entity ? this.entity.nid : '')
    },
  },
  async created() {
    await this.$store.dispatch('edu_admission/ensureAll')
    await this.fetch()
  },
  methods: {
    onNavCompetition(compet) {
      this.$util.dom.scrollTo({el: this.$refs['compet-' + compet.id][0], offset: 0, duration: true})
    },
    async onStartGenerate() {
      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/generate.gql'),
          variables: {
            id: this.entityIdState,
          }
        })
        if (res.result.success) {
          await this.fetch()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async onSubmitCommit() {
      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/update.gql'),
          variables: {
            id: this.entityIdState || this.entityIdTemp,
            action: this.actionState,
            model: this.entityForSave(this.entityState)
          }
        })
        if (res.result.success) {
          if (this.actionState === 'create') {
            this.entityIdState = res.payload.entityId
            this.actionState = 'edit'
            await this.fetch()
          }
          this.onResolve && this.onResolve()
        }
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
    async fetch() {
      if (this.actionState !== 'create') {
        try {
          const entity = await this.$store.dispatch('gql/fetch', {
            query: require('../gql/query/single.gql'),
            variables: {
              filter: {
                _id: {eq: this.entityIdState}
              }
            },
            state: this.requestState,
          })
          this.orderIdState = entity.orderId
          this.assignEntity(entity)
        } catch (e) {
          console.log(e)
        }
      } else {
        this.assignEntity({})
      }
    },

    async loadCompareRating(ratingId) {
      try {
        this.compareRating = await this.$store.dispatch('gql/fetch', {
          query: require('../gql/query/single.gql'),
          variables: {
            filter: {
              _id: {eq: ratingId}
            }
          },
          state: this.requestState,
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  watch: {
    compareRatingId(id) {
      this.loadCompareRating(id)
    }
  }
}

</script>

<style lang="scss" scoped>

.s-accent {

}

.s-changed {
  font-weight: bold;
  color: #d21e1e;
}
</style>
