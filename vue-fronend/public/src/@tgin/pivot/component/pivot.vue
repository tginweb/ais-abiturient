<template>
  <div>

    <json-viewer v-if="false" :value="dataComp"/>

    <vue-pivottable-ui
        :aggregator-name="pivot.aggregatorName"
        :col-total="true"
        :cols="cols"
        :rows="rows"
        :data="dataComp"
        :row-total="true"
        :vals="aggregatorVals"
        :localeStrings="pivotLocales.ru"
        style="table-layout: auto;"
    />
  </div>

</template>

<script>

export default {

  components: {},
  props: {
    loading: {},
    rendererName: {},
    preset: {},
    items: {},
    editable: {},
    cols: {},
    rows: {},
  },
  data() {
    return {

      pivot: {
        aggregatorName: 'Count',
        aggregatorVal: 'Количество',
        rendererName: 'Стат',
        disabledFromDragDrop: ['Party Size', 'Payer Gender'],
        hiddenFromDragDrop: ['Total Bill'],
        options: {
          rows: [],
          cols: [],
        },
      },

      pivotLocales: {
        ru: {

          renderError: "Ошибка рендеринга страницы.",
          computeError: "Ошибка табличных расчетов.",
          uiRenderError: "Ошибка во время прорисовки и динамического расчета таблицы.",
          selectAll: "Выбрать все",
          selectNone: "Снять выделение",
          tooMany: "(Выбрано слишком много значений)",
          filterResults: "Возможные значения",
          totals: "Всего",
          vs: "на",
          by: "с",

          rendererMap: {
            'Table': 'Таблица',
            'Table Heatmap': 'Table Heatmap',
            'Table Col Heatmap': 'Table Col Heatmap',
            'Table Row Heatmap': 'Table Row Heatmap',
            'Export Table TSV': 'Export Table TSV',
            'Grouped Column Chart': 'Grouped Column Chart',
            'Stacked Column Chart': 'Stacked Column Chart',
            'Grouped Bar Chart': 'Grouped Bar Chart',
            'Stacked Bar Chart': 'Stacked Bar Chart',
            'Line Chart': 'Line Chart',
            'Dot Chart': 'Dot Chart',
            'Area Chart': 'Area Chart',
            'Scatter Chart': 'Scatter Chart',
            'Multiple Pie Chart': 'Multiple Pie Chart'
          },
          aggregatorMap: {
            Count: 'Кол-во',
            'Count Unique Values': 'Кол-во уникальных',
            'List Unique Values': 'Список уникальных',
            Sum: 'Сумма',
            'Integer Sum': 'Сумма целых',
            Average: 'Среднее',
            Median: 'Median',
            'Sample Variance': 'Sample Variance',
            'Sample Standard Deviation': 'Sample Standard Deviation',
            Minimum: 'Минимум',
            Maximum: 'Максимум',
            First: 'First',
            Last: 'Last',
            'Sum over Sum': 'Сумма по сумме',
            'Sum as Fraction of Total': 'Доля по всему',
            'Sum as Fraction of Rows': 'Доля по строке',
            'Sum as Fraction of Columns': 'Доля по столбцу',
            'Count as Fraction of Total': 'Кол-во по всему',
            'Count as Fraction of Rows': 'Кол-во по строке',
            'Count as Fraction of Columns': 'Кол-во по столбцу'
          }
        }

      },
    }
  },
  created() {

  },
  computed: {
    aggregatorVals() {
      return [this.pivot.aggregatorVal]
    },
    dataComp() {
      return [this.columnsComp, ...this.rowsComp]
    },
    columnsComp() {
      return this.items[0] ? Object.keys(this.items[0]) : []
    },
    rowsComp() {
      return this.items.map(item => {
        return Object.values(item)
      })
    },
  },
  watch: {},
  methods: {}
}
</script>
<style lang="scss" scoped>


</style>
