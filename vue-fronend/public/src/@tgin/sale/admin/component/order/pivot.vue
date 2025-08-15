<template>
  <div class="relative-position">

    <div class="flex items-center q-mb-md">
      <div class="q-mr-md">
        Группировка по:
      </div>
      <q-btn-toggle
        v-model="pivot.aggregatorVal"
        toggle-color="primary"
        dense
        class=""
        :options="[
        {label: 'Цена', value: 'Цена'},
        {label: 'Кол-во', value:  'Количество'},
      ]"
      />
    </div>

    <component
      :is="editable ? 'vue-pivottable-ui':'vue-pivottable'"
      :aggregator-name="pivot.aggregatorName"
      :col-total="true"
      :cols="pivotOptions.cols"
      :data="pivotItems"
      :row-total="true"
      :rows="pivotOptions.rows"
      :vals="aggregatorVals"
      :localeStrings="pivotLocales.ru"
      style="table-layout: auto;"
    />

    <q-inner-loading :showing="loading">
      <q-spinner-gears color="primary" size="50px"/>
    </q-inner-loading>

  </div>
</template>

<script>

export default {

  components: {
  },
  props: {
    loading: {},
    rendererName: {},
    preset: {},
    items: {},
    editable: {}
  },

  data() {
    return {
      pivot: {
        aggregatorName: 'Sum',
        aggregatorVal: 'Цена',

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
    pivotOptions() {
      return this.$store.getters['sale_admin/pivotPresetsById'][this.preset]
    },
    pivotItems() {

      return [
        ...[[
          'ID',
          'Наименование',
          'Количество',
          'Цена',
          'Категория',
          'Раздел',
          'Дата оплаты',
          'Год оплаты',
          'Месяц оплаты',
          'День оплаты',
        ]],
        ...this.itemsPivotable
      ];
    },

    itemsPivotable() {
      return this.itemsComp.map(item => {
        return [
          item.ID,
          item.NAME,
          item.QUANTITY,
          item.FINAL_PRICE,
          item.SECTION_NAME,
          item.ROOT_SECTION_NAME,
          item.PAID_DATE_FORMATTED,
          item.PAID_DATE_YEAR,
          item.PAID_DATE_MONTH,
          item.PAID_DATE_DAY,
        ]
      })
    },

    itemsComp() {

      return this.items.map(item => {

        const result = {
          ...item
        }

        if (item.ORDER) {

          const order = item.ORDER

          result.PAID = order && order.IS_PAID ? 'да' : 'нет'

          if (order.IS_PAID) {
            result.PAID_DATE_FORMATTED = this.$util.date.timestampToFormat(order.DATE_PAYED, 'DD.MM.YYYY')
            result.PAID_DATE_YEAR = this.$util.date.timestampToFormat(order.DATE_PAYED, 'YYYY')
            result.PAID_DATE_MONTH = this.$util.date.timestampToFormat(order.DATE_PAYED, 'MMMM')
            result.PAID_DATE_DAY = this.$util.date.timestampToFormat(order.DATE_PAYED, 'DD')
          } else {
            result.PAID_DATE_FORMATTED = 'не оплачено'
            result.PAID_DATE_YEAR = 'нет'
            result.PAID_DATE_MONTH = 'нет'
            result.PAID_DATE_DAY = 'нет'
          }

        }

        if (item.ELEMENT) {

          const element = item.ELEMENT

          result.NAME = element.NAME

          if (element.PARENT) {
            result.ROOT_SECTION = element.PARENT.ROOT_SECTION
            result.SECTION = element.PARENT.SECTION
          } else {
            result.ROOT_SECTION = element.ROOT_SECTION
            result.SECTION = element.SECTION
          }
        }

        if (result.ROOT_SECTION) {
          result.ROOT_SECTION_NAME = result.ROOT_SECTION.NAME
        }

        if (result.SECTION) {
          result.SECTION_NAME = result.SECTION.NAME
        }

        return result;
      })
    }
  },
  watch: {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>


</style>
