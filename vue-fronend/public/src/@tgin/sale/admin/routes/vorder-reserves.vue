<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="pageTitle"
      dialogWidth="1150px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >
    <template v-slot:default="ctx">

      <div class="">

        <div class="">

          <ui-data-panel
              :data.sync="items"
              ref="orders"
              :filters-enable="true"
              :filter-width="18"
              :height="(scrollHeight - 50) + 'px'"
              :table-height="(parseInt(scrollHeight/2)-50)+'px'"
          >
            <template v-slot:filters-bottom>

              <div class="q-mt-lg">

                <q-select
                    v-model="unitDurationState"
                    :options="[
                        {label: '1 мин', value: 1 * 60},
                        {label: '2 мин', value: 2 * 60},
                        {label: '3 мин', value: 3 * 60},
                        {label: '5 мин', value: 5 * 60},
                        {label: '10 мин', value: 10 * 60},
                        {label: '15 мин', value: 15 * 60},
                        {label: '20 мин', value: 20 * 60},
                        {label: '30 мин', value: 30 * 60},
                        {label: '1 час', value: 60 * 60},
                    ]"
                    emit-value
                    label="Градация"
                    map-options
                    outlined
                />

              </div>

            </template>

            <template v-slot:main-bottom>

              <div class="q-pt-md q-px-lg" style="border-top: 3px solid #eee;">

                <Bar
                    v-if="scrollHeight>0"
                    :chart-options="chartOptions"
                    :chart-data="chartSource"
                    :chart-id="chartId"
                    :dataset-id-key="datasetIdKey"
                    :plugins="plugins"
                    :css-classes="cssClasses"
                    :height="parseInt(scrollHeight/2) - 50"
                />

              </div>

            </template>

          </ui-data-panel>
        </div>

      </div>


    </template>

  </component>
</template>

<script>

import CTable from "../component/vorder-reserve/list/table";
import MVroute from '@tgin/ui/admin/mixin/vroute'

import {Bar} from 'vue-chartjs/legacy'

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import colorGradient from "javascript-color-gradient";


ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    BarElement,
    LinearScale,
    CategoryScale,
    PointElement
)

export default {
  mixins: [MVroute],
  components: {
    CTable,
    Bar
  },
  props: {},
  data() {
    const now = Date.now() - 24 * 60 * 60 * 1000
    const dateFrom = this.$util.date.timestampToFormat(now - 12 * 60 * 60 * 1000, 'DD.MM.YYYY HH:mm')
    const dateTo = this.$util.date.timestampToFormat(now + 12 * 60 * 60 * 1000, 'DD.MM.YYYY HH:mm')

    return {
      items: {
        table: {
          height: 'calc(100vh - 240px)',
          com: CTable
        },
        recordsetQuery: () => require('../gql/vorder-reserve/query/recordset.gql'),
        filterQuery: () => require('../gql/vorder-reserve/query/filters.gql'),
        filterSchema: [],
        filter: {
          'DATE_FROM': {'eq': dateFrom},
          'DATE_TO': {'eq': dateTo},
        },
        where: {
          MODE: this.viewId,
        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 10
        },
        status: {
          loaded: false,
          loading: false,
        },
      },

      chartId: 'bar-chart',
      datasetIdKey: 'label',
      cssClasses: '',
      plugins: [],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      },

      unitDurationState: 60 * 5
    }
  },
  methods: {},
  watch: {
    viewId(val) {
      this.orders.where.MODE = val
    }
  },
  computed: {

    colors() {
      let cnt = this.deltaMax - 40
      if (cnt <= 0) cnt = 1
      return colorGradient
          .setGradient("#45bd56", "#be1b00")
          .setMidpoint(cnt)
    },

    unitDuration() {
      return this.unitDurationState
    },

    rowsDelta() {
      return this.items.rows.map(item => parseInt(item.NEED_DELTA))
    },

    rowsDateNeed() {
      return this.items.rows.map(item => parseInt(item.DATE_NEED))
    },

    deltaMin() {
      return Math.min.apply(null, this.rowsDelta)
    },

    deltaMax() {
      return Math.max.apply(null, this.rowsDelta)
    },

    dateNeedMin() {
      if (this.items.filter.DATE_FROM.eq)
        return this.$util.date.parseTime(this.items.filter.DATE_FROM.eq, 'DD.MM.YYYY HH:mm', 'ts')
      else
        return Math.min.apply(null, this.rowsDateNeed)
    },

    dateNeedMax() {
      if (this.items.filter.DATE_TO.eq)
        return this.$util.date.parseTime(this.items.filter.DATE_TO.eq, 'DD.MM.YYYY HH:mm', 'ts')
      else
        return Math.max.apply(null, this.rowsDateNeed)
    },

    chartValues() {
      return this.items.rows.map(item => {
        return {
          date: item.DATE_NEED,
          value: item.NEED_DELTA,
        }
      })
    },

    chartUnits() {
      const period = this.dateNeedMax - this.dateNeedMin

      const count = parseInt(period / this.unitDuration)

      const units = []

      const dates = {}

      for (let i = 0; i <= count + 1; i++) {

        const timeFrom = this.dateNeedMin + this.unitDuration * i
        const timeFromDate = this.$util.date.timestampToFormat(timeFrom, 'DD.MM')
        const timeTo = timeFrom + this.unitDuration

        let timeLabel = null

        if (!dates[timeFromDate]) {
          timeLabel = this.$util.date.timestampToFormat(timeFrom, 'DD.MM.YYYY HH:mm')
          dates[timeFromDate] = true
        } else {
          timeLabel = this.$util.date.timestampToFormat(timeFrom, 'HH:mm')
        }

        units.push({
          label: timeLabel,
          timeFrom: timeFrom,
          timeTo: timeTo
        })
      }

      return units
    },

    chartSource() {

      const chartValues = this.chartValues

      const labels = this.chartUnits.map(item => item.label)

      const data = this.chartUnits.map(item => {

        const val = chartValues.find(value => {
          return value.date >= item.timeFrom && value.date < item.timeTo
        })

        return val ? val.value : 0
      })

      const backgroundColors = this.chartUnits.map((item, index) => {
        let c = data[index] - 40
        if (c <= 0) c = 1
        return this.colors.getColor(c)
      })

      const result = {
        labels: labels,
        datasets: [
          {
            // label: 'Data One',
            borderColor: '#6ac1ea',
            backgroundColor: backgroundColors,
            data: data
          }
        ]
      }

      return result
    },

    chart() {

      const res = {}

      return res
    },

    views() {
      return [
        {id: 'active', label: 'Активные'},
        {id: 'completed', label: 'Завершенные'},
        {id: 'canceled', label: 'Отмененные'},
        {id: 'all', label: 'Все'},
      ]
    },
    pageTitle() {
      return 'Заказы: ' + (this.view ? this.view.label : '')
    },
    toolbarMenu() {
      return []
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
