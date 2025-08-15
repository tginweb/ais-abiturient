<template>

  <component
      v-model="visible"
      :loading="fetching"
      :title="title"
      dialogMaxWidth="96vw"
      dialogWidth="1750px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >

    <div v-if="entity">

      <div v-if="false" class="q-mb-md">
        <q-btn
            label="отправить Абитуриента"
        />
        <q-btn
            label="отправить КГ"
        />
      </div>

      <div class="row q-mb-lg q-col-gutter-lg">
        <div class="col-12">
          <ui-admin-data-card
              :fields="fields"
          />
        </div>
        <div class="col-12">
          <ui-admin-data-card
              :fields="fieldsSecondary"
          />
        </div>
      </div>

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
        <q-tab label="Рейтинговый список" name="list"/>
        <q-tab label="Зачисленные" name="prezach"/>
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-transparent" keep-alive>
        <q-tab-panel class="q-px-none" name="list">
          <div class="flex q-mb-sm">

            <q-option-group
                v-model="priority"
                :multiple="true"
                :options="[
                    {label: '1', value: 1},
                    {label: '2', value: 2},
                    {label: '3', value: 3},
                    {label: '4', value: 4},
                    {label: '5', value: 5},
                ]"
                inline
                type="checkbox"
            />

            <q-checkbox
                v-model="filterPodl"
                class="q-ml-lg"
                label="только подлинники"
            />

            <q-checkbox
                v-model="filterEnoughtTests"
                class="q-ml-lg"
                label="проходные по мин. баллам"
            />

            <q-checkbox
                v-model="showCompets"
                class="q-ml-lg"
                label="показать все КГ абитуриента"
            />

            <div class="q-ml-auto">
              <q-btn
                  color="primary"
                  label="скачать Excel"
                  @click="exportExcel"
              />
            </div>
          </div>
          <q-markup-table
              ref="table"
              bordered
              class="text-center s-table"
              style="overflow: scroll;"
          >
            <thead>
            <tr>
              <th>№</th>
              <th>ФИО</th>
              <th>Статус абитуриента</th>
              <template v-if="false">
                <th>ENTRANT GUID</th>
                <th>APP GUID</th>
              </template>
              <th>ВИ</th>
              <th>БАЛЛ ИД</th>
              <th>БАЛЛ</th>
              <th>ПРИОР</th>
              <th>ПОДЛ</th>
              <th></th>
              <th v-if="showCompets">Все конкурсные группы абитуриента</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(item,index) of apps"
                class="cursor-pointer"
                @click="$router.push('/admin/edu/order/'+item.order.id+'/view').catch(()=> {})"
            >
              <td>
                {{ index + 1 }}
              </td>
              <td>
                <CPerson
                    v-if="item.order"
                    :order="item.order"
                />
                <div class="q-mt-sm">
                  {{ item.order.phone }}
                </div>
              </td>
              <td>
                <CStatus
                    v-if="item.order"
                    :order="item.order"
                />
              </td>
              <template v-if="false">
                <td>
                  {{ item.order.epgu.guid }}
                </td>
                <td>
                  {{ item.app.epgu.appGuid }}
                  <q-checkbox
                      v-if="!item.app.epgu.appGuid"
                      :value="appsToAdd[item.app.id] || false"
                      @input="onAppSelect(item.app.id)"
                  />
                </td>
              </template>
              <td>

                <div v-if="!item.enoughTests" class="bg-red-8 text-white q-px-md text-center q-mb-xs inline-bolock">
                  недостаточно ВИ
                </div>

                <ul class="q-px-sm q-mt-none">
                  <li
                      v-for="test of item.tests" :class="{
                        'text-red-8': !test.minimalReached
                      }"
                      style="white-space: nowrap;"
                  >
                    {{ test.subjectName }} - {{ test.ball }}
                  </li>
                </ul>

              </td>

              <td>
                <div v-if="item.achievementBall" class="s-font-lg">
                  {{ item.achievementBall }}
                </div>
              </td>
              <td style="text-align: center;">
                <div
                    class="s-font-xl q-pa-sm"
                    style="display: inline-block; border: 1px solid #555; border-radius: 10px;"
                >
                  {{ item.ball }}
                </div>
              </td>
              <td>
                <div class="s-font-xl">
                  № {{ item.priority }}
                </div>
              </td>
              <td
                  :class="{
                  'bg-green-5 text-white': item.podldoc
                }"
              >
                <div class="s-font-lg">
                  {{ item.podldoc ? 'ДА' : '' }}
                </div>
              </td>

              <td>

                <template v-if="false">
                  <div v-if="item.order.prezachCompetition" class="">
                    будет зачислен в
                    <div
                        class="text-bold s-font-lg"
                        :class="{
                          'text-grey-9': item.order.prezachCompetitionId !== entity.id,
                          'text-yellow-9': item.order.prezachCompetitionId === entity.id,
                      }"
                    >{{ item.order.prezachCompetition.name }}</div>
                  </div>

                  <q-btn
                      v-if="
                      item.podldoc &&
                      (
                        !item.order.prezachCompetitionId ||
                        (item.order.prezachCompetitionId !== entity.id && item.order.prezachStatus==='move')
                      )
                    "
                      color="primary"
                      label="Зачислить в КГ"
                      no-wrap
                      @click.stop="setPredzachCompet(item)"
                  />
                </template>

              </td>

              <td v-if="showCompets">

                <div class="q-gutter-md">
                  <div
                      v-for="appGroup of item.order.appGroups"
                      :key="appGroup.id"
                  >

              <q-markup-table
                  bordered
                  class="s-font-2xs "
                  dense
                  flat
                  style="width:auto;"
              >

            <tbody>
            <tr
                v-for="app of ([...appGroup.appsActive].sort((a, b) => ((a.priority > b.priority) ? 1 : -1)) || [])"
                :key="app._id"
            >
              <td style="width:15px;">
                {{ app.priority }}
              </td>
              <td class="text-left">{{ $util.base.deepGet(app, 'competition.name') }}</td>
              <td class="text-right">
                {{ app.statusTitle }}
              </td>
            </tr>
            </tbody>
          </q-markup-table>


    </div>
    </div>


    </td>
    </tr>
    </tbody>
    </q-markup-table>
    </q-tab-panel>
    <q-tab-panel class="q-px-none" name="prezach">
      <div class="flex q-mb-sm">

        <q-checkbox
            v-model="filterAccepted"
            class="q-ml-lg"
            label="только включаемые в приказ"
        />

        <div class="q-ml-auto">
          <q-btn
              color="primary"
              label="скачать Excel"
              @click="exportExcel"
          />
        </div>
      </div>
      <q-markup-table
          ref="table"
          bordered
          class="text-center s-table"
      >
        <thead>
        <tr>
          <th>№</th>
          <th>ФИО</th>
          <th>Статус абитуриента</th>
          <th>ВИ</th>
          <th>БАЛЛ ИД</th>
          <th>БАЛЛ</th>
          <th>ПРИОР</th>
          <th>ПРИОР</th>
          <th v-if="false">Статус</th>
          <th v-if="false">Статус В ПРИКАЗЕ на ЕПГУ</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item,index) of appsPredzach"
        >
          <td>
            {{ index + 1 }}
          </td>
          <td
              class="cursor-pointer"
              @click="$router.push('/admin/edu/order/'+item.order.id+'/view').catch(()=> {})"
          >
            <CPerson
                v-if="item.order"
                :order="item.order"
            />
            <div class="q-mt-sm">
              {{ item.order.phone }}
            </div>
          </td>
          <td>
            <CStatus
                v-if="item.order"
                :order="item.order"
            />

          </td>
          <td>

            <div v-if="!item.enoughTests" class="bg-red-8 text-white q-px-md text-center q-mb-xs inline-bolock">
              недостаточно ВИ
            </div>

            <ul class="q-px-sm q-mt-none">
              <li
                  v-for="test of item.tests" :class="{
                        'text-red-8': !test.minimalReached
                      }"
                  style="white-space: nowrap;"
              >
                {{ test.subjectName }} - {{ test.ball }}
              </li>
            </ul>

          </td>

          <td>
            <div v-if="item.achievementBall" class="s-font-lg">
              {{ item.achievementBall }}
            </div>
          </td>
          <td style="text-align: center;">
            <div
                class="s-font-xl q-pa-sm"
                style="display: inline-block; border: 1px solid #555; border-radius: 10px;"
            >
              {{ item.ball }}
            </div>
          </td>
          <td>
            <div class="s-font-xl">
              № {{ item.priority }}
            </div>
          </td>


          <td
              :class="{
                  'status-filled bg-green-5 text-white': item.order.prezachStatus === 'accepted',
                  'status-filled bg-red-10 text-white': item.order.prezachStatus === 'deny',
                }"
              v-if="false"
          >

            <q-select
                v-model="item.order.prezachStatus"
                :options="[
                      {label: 'рассмотрение', value: 'pending'},
                      {label: 'включить в приказ', value: 'accepted'},
                      {label: 'отклонить зачисление', value: 'deny'},
                      {label: 'перенести в другой конкурс', value: 'move'},
                    ]"
                emit-value
                label="СТАТУС ЗАЧИСЛЕНИЯ"
                map-options
                outlined
                style="background-color: #FFF;max-width:260px;"
                @input="onPredZachStatusInput(item, $event)"
            />

          </td>

          <td v-if="false">
            нет
          </td>
          <td>
             {{item.order.uid}}
          </td>

        </tr>
        </tbody>
      </q-markup-table>


    </q-tab-panel>
    </q-tab-panels>
    </div>


  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import CPerson from "~module/edu-org/modules/order/component/person";
import CStatus from "~module/edu-org/modules/order/component/status";

export default {
  mixins: [MVroute],
  props: {},
  components: {
    CPerson,
    CStatus
  },
  data() {
    return {
      filterPodl: false,
      filterEnoughtTests: false,
      filterAccepted: false,
      priority: [],
      tab: 'list',
      appsToAdd: {},
      showCompets: false
    }
  },
  computed: {
    appsPredzach() {
      return this.entity.appsRating.filter(item => {
        return (item.order.prezachCompetitionId === this.entity.id) && (!this.filterAccepted || item.order.prezachStatus === 'accepted')
      })
    },

    apps() {
      return this.entity.appsRating.filter(app => {
        if (this.priority.length && this.priority.indexOf(parseInt(app.priority)) === -1) return false
        if (this.filterPodl && !app.podldoc) return false
        if (this.filterEnoughtTests && !app.enoughTests) return false
        return true
      })
    },

    fields() {
      const res = []

      res.push({
        value: this.entity.id + ' / ' + this.entity.uid,
        label: 'ID / UID'
      })

      res.push({
        value: this.entity.name,
        label: 'Конкурс'
      })

      res.push({
        value: this.entity.admission.direct_name,
        label: 'Направление'
      })

      res.push({
        value: this.entity.admission.fob.name,
        label: 'Форма'
      })

      return res
    },

    fieldsSecondary() {
      const res = []

      res.push({
        value: this.entity.admissionNumberTotal,
        label: 'Мест'
      })

      res.push({
        value: this.entity.appsCount,
        label: 'Заявлений'
      })

      res.push({
        value: this.entity.ratio,
        label: 'Заявлений на место'
      })

      return res
    },


    title() {
      return 'Просмотр конкурса ' + (this.entity ? this.entity.id : '')
    },

  },
  created() {
    this.fetch()
  },
  watch: {
    showCompets(v) {
      if (v) {
        this.fetch()
      }
    }
  },
  methods: {

    async onPredZachStatusInput(item, status) {

        try {

          const res = await this.$store.dispatch('gql/mutation', {
            mutation: require('~module/edu-org/modules/order/gql/order/mutation/set_predzach_status.gql'),
            variables: {
              id: item.order.id,
              status: status,
            },
            state: this.requestState,
          })

          console.log(res)
        } catch (e) {
          console.log(e)
        }

    },

    async onPredzachStatusSave() {

    },

    async setPredzachCompet(item) {

      try {

        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('~module/edu-org/modules/order/gql/order/mutation/set_predzach_compet.gql'),
          variables: {
            id: item.order.id,
            competitionId: this.entity.id
          },
          state: this.requestState,
        })

        await this.fetch()

        console.log(res)
      } catch (e) {
        console.log(e)
      }

    },
    onSendCompet() {

      this.$store.dispatch('edu_epgu_message/apiMutate', {
        mutation: 'createFromEntities',
        messageType: 'ApplicationListAddMultiple',
        entityType: 'edu_order',
        split: 99
      })

    },

    onAppSelect(id) {
      this.$set(this.appsToAdd, id, !this.appsToAdd[id])
    },

    exportExcel() {

      const table = this.$refs.table.$el.getElementsByTagName("table")[0]

      let tableData = table.outerHTML;

      tableData = tableData.replace(/<i[^>]*>.*?<\/i>/gi, "");

      tableData = this.$util.html.stripTags(tableData, '<table><thead><tbody><tr><td><th>')

      let a = document.createElement('a');
      a.href = `data:application/vnd.ms-excel, ${encodeURIComponent(tableData)}`
      a.download = 'downloaded_file.xls'
      a.click()
    },

    async fetch(refetch) {
      await this.fetchingMethod(async () => {
        this.entity = await this.$store.dispatch('edu_competition/fetchSingle', {
          id: this.entityId,
          withApps: this.showCompets,
        })
      })
    },
  },

}

</script>

<style lang="scss" scoped>

.s-accent {

}

.status-filled {

}
</style>
