<template>
  <component
      v-model="visible"
      :scroll-height.sync="scrollHeight"
      :title="page.title"
      dialog-width="1150px"
      v-bind="bindRouterWrapper"
      @hide="onHide"

  >

    <template v-slot:default="ctx">


      <div class="q-px-lg">
        <div class="row q-col-gutter-md">

          <div class="col-6">
            <div>
              ЛК
            </div>
            <q-select
                v-model="inOrders"
                :options="[
                    {label: '', value: null},
                    {label: 'да', value: true},
                    {label: 'нет', value: false},
                ]"
                emit-value
                label="Есть в ордерах"
                map-options
            />
            <q-select
                v-model="filter.cis.doubles"
                :options="[
                    {label: '', value: null},
                    {label: 'да', value: true},
                    {label: 'нет', value: false},
                ]"
                emit-value
                label="Есть дубли"
                map-options
            />
            <q-checkbox
                v-model="filter.cis.markedToDelete"
                label="marked to delete"
             />
          </div>

          <div class="col-6">
            <div>
              АИС
            </div>
            <q-select
                v-model="inAis"
                :options="[
                    {label: '', value: null},
                    {label: 'да', value: true},
                    {label: 'нет', value: false},
                ]"
                emit-value
                label="Есть в АИС"
                map-options
            />
          </div>

          <div class="col-6">
            <div>
              Старый ЛК
            </div>
            <q-select
                v-model="inLk"
                :options="[
                    {label: '', value: null},
                    {label: 'да', value: true},
                    {label: 'нет', value: false},
                ]"
                emit-value
                label="Есть в ЛК"
                map-options
            />
          </div>

          <div class="col-6">
            <q-select
                v-model="wrongLastName"
                :options="[
                    {label: '', value: null},
                    {label: 'да', value: true},
                    {label: 'нет', value: false},
                ]"
                emit-value
                label="Фамилия расходится"
                map-options
            />
          </div>

        </div>
      </div>

      <q-markup-table
          v-if="true"
          class="c-achievements s-table"
          flat
      >
        <thead>
        <tr class="text-left">
          <th class="dense">ID</th>
          <th class="dense">Итог</th>
          <th class="dense">АИС</th>
          <th class="dense">ЛК</th>
          <th class="dense">Фамилии</th>
          <th class="dense">index</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(uidMap, uid, index) of groupedByUidFiltered"
            :key="uid"
            class="__item"
        >
          <td class="dense">
            <div style="width: 160px;overflow: hidden;">
              {{ uid }}
            </div>
          </td>
          <td class="dense">
            <div class="q-gutter-lg">
              <table class="s-internal-table full-width">
                <tr
                    v-for="order in uidMap.orders"
                    class="q-pa-sm cursor-pointer"
                    style="border: 1px solid #DDD"
                    @click="$router.push('/admin/edu/order/'+order.id+'/view').catch(()=> {})"
                    :class="{
                      's-marked-delete': !!ordersToDelete[order.id]
                    }"
                >
                  <td style="width: 10px">
                    <q-checkbox
                     :value="ordersToDelete[order.id] || false"
                     @input="onDeleteOrderMark(order)"
                    />
                  </td>

                  <td style="width: 60px">
                    {{ order.nid }}
                  </td>
                  <td style="width: 150px;white-space: normal;">
                    {{ order.fio }}
                  </td>
                  <td style="white-space: normal;width:130px;">
                    {{ order.statusName }}
                  </td>
                  <td style="white-space: normal;">

                    <div v-for="appGroup of order.appGroups">

                      <div style="font-weight:bold;">{{appGroup.isBudget ? 'бюджет' : 'коммерция'}}</div>

                      <table class="s-internal-table">
                        <tr
                            v-for="app in appGroup.appsActive"
                            style="border: 1px solid #DDD"
                        >
                          <td>
                            {{ app.priority }}
                          </td>
                          <td style="width:180px;max-width: 180px">
                            {{ app.competition.name }}
                          </td>
                          <td
                              style="width:120px;max-width: 120px;font-weight:bold;"
                              class=""
                              :style="{
                                color: app.statusColor
                              }"
                          >
                            {{app.statusTitle}}
                          </td>
                        </tr>
                      </table>
                    </div>

                  </td>
                  <td style="white-space: normal;" valign="top">

                      <table class="s-internal-table">
                        <tr
                            v-for="test in order.tests"
                            style="border: 1px solid #DDD"
                        >
                          <td style="width: 130px">
                            {{ test.subjectName }}
                          </td>
                          <td style="white-space: normal;width:30px;">
                            {{ test.ball }}
                          </td>
                        </tr>
                      </table>

                  </td>
                  <td>
                    <div v-if="order.podldocAny" class="bg-green text-white">
                      подл
                    </div>
                  </td>
                  <td>
                    <b class="text-red">{{order.achievements.length}}</b>
                  </td>

                </tr>
              </table>
            </div>
          </td>
          <td class="dense">
            <div class="q-gutter-lg">
              <div v-for="order in uidMap.ais" class="q-pa-sm" style="border: 1px solid #DDD">
                {{ order.fio }} [{{ order.nid }}]
              </div>
            </div>
          </td>
          <td class="dense">
            <div class="q-gutter-lg">
              <div v-for="order in uidMap.lk" class="q-pa-sm" style="border: 1px solid #DDD">
                {{ order.fio }} [{{ order.nid }}]
              </div>
            </div>
          </td>
          <td class="dense">
            <ul class="q-ml-sm">
              <li v-for="lastName of uidMap.lastName">
                {{ lastName }}
              </li>
            </ul>
          </td>
          <td class="dense">
            {{ index + 1 }}
          </td>
        </tr>
        </tbody>
      </q-markup-table>
      <q-btn
          label="assign"
          @click="onAssign"
      />
    </template>

  </component>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'

import CTable from "../component/entity/list/list"

export default {
  mixins: [MVroute],
  components: {
    CTable,

  },
  props: {},
  apollo: {
    sverka: {
      query: require('../gql/order/query/sverka.gql'),
      update: data => data.res,
    },
  },
  data() {
    return {
      ordersToDelete: {},
      sverka: null,
      tableMode: 'table',
      page: {
        title: 'Абитуриенты для администратора'
      },
      inAis: null,
      inOrders: null,
      inLk: null,

      filter: {
        cis: {
          doubles: null,
          markedToDelete: false
        }
      },

      wrongLastName: null,
    }
  },
  mounted() {
    this.ordersToDelete = this.$q.localStorage.getItem('selectedOrders') || {}
  },
  computed: {

    groupedByUidFiltered() {
      const res = {}

      let cnt = 1
      for (const [uid, uidMap] of Object.entries(this.groupedByUid)) {
        cnt++

        if (cnt>50) {
         // break
        }

        if (typeof this.inAis === 'boolean') {
          if (this.inAis && !uidMap.ais.length)
            continue;
          if (!this.inAis && !!uidMap.ais.length)
            continue;
        }

        if (typeof this.inOrders === 'boolean') {
          if (this.inOrders && !uidMap.orders.length)
            continue;
          if (!this.inOrders && !!uidMap.orders.length)
            continue;
        }

        if (typeof this.inLk === 'boolean') {
          if (this.inLk && !uidMap.lk.length)
            continue;
          if (!this.inLk && !!uidMap.lk.length)
            continue;
        }

        if (typeof this.wrongLastName === 'boolean') {
          if (this.wrongLastName && (Object.values(uidMap.lastName).length === 1))
            continue;
          if (!this.wrongLastName && (Object.values(uidMap.lastName).length > 1))
            continue;
        }

        if (typeof this.filter.cis.doubles === 'boolean') {
          if (this.filter.cis.doubles && (uidMap.orders.length <= 1))
            continue;
          if (!this.filter.cis.doubles && (uidMap.orders.length > 1))
            continue;
        }

        if (this.filter.cis.markedToDelete) {
          let good
          uidMap.orders.forEach((order)=>{
            if (this.ordersToDelete[order.id]) {
              good = true
            }
          })
          if (!good)
            continue;
        }


        res[uid] = uidMap
      }
      return res
    },

    groupedByUid() {

      if (!this.sverka) {
        return {}
      }

      const res = {}

      const ensureUid = (uid) => {
        res[uid] = {
          ais: [],
          orders: [],
          lk: [],
          lastName: {}
        }
      }

      this.sverka.orders.forEach((item) => {
        if (!res[item.uid]) {
          ensureUid(item.uid)
        }
        res[item.uid].orders.push(item)
        res[item.uid].lastName[item.lastName] = item.lastName
      })

      this.sverka.aisEntrants.forEach((item) => {
        if (!res[item.uid]) {
          ensureUid(item.uid)
        }
        res[item.uid].ais.push(item)
        res[item.uid].lastName[item.lastName] = item.lastName
      })

      this.sverka.lk.forEach((item) => {
        if (!res[item.uid]) {
          ensureUid(item.uid)
        }
        res[item.uid].lk.push(item)
        res[item.uid].lastName[item.lastName] = item.lastName
      })

      return res
    },

    toolbarMenu() {
      return [
        {
          label: 'Добавить абитуриента',
          path: {name: 'edu.order:add'}
        }
      ]
    }
  },

  methods: {
    async onAssign() {
      console.log('ddd')
      await this.$store.dispatch('edu_order/apiMutate', {
        mutation: 'action',
        action: 'delete',
        ids: Object.keys(this.ordersToDelete).filter(id => !!this.ordersToDelete[id])
      })
      console.log('bb')
    },
    onDeleteOrderMark(order) {
      this.$set(this.ordersToDelete, order.id, !this.ordersToDelete[order.id])
      this.$q.localStorage.set('selectedOrders', this.ordersToDelete)
    }
  }
}
</script>
<style lang="scss" scoped>

.s-internal-table {
  border-collapse: collapse;

  td {
    border: 1px solid #ddd;
    white-space: normal !important;
  }
}

.s-marked-delete {
  background-color: #f6bfab;
}

</style>
