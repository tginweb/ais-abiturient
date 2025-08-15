import timestampToFormat from "@tgin/main/common/lib/util/date/timestampToFormat";

export function pivotPresetsById(state, getters, rootState) {
  return getters.pivotPresets.reduce((map, obj) => (map[obj.value] = obj, map), {})
}

export function pivotPresets(state, getters, rootState) {
  return [
    {
      value: 'all',
      label: 'Без группировки',
      cols: [],
      rows: [],
      vals: ['Цена'],
    },
    {
      value: 'by_rootsection',
      label: 'Раздел',
      cols: [],
      rows: ['Раздел'],
      vals: ['Цена'],
    },
    {
      value: 'by_rootsection_section_name',
      label: 'Раздел + категория + товар',
      cols: [],
      rows: ['Раздел', 'Категория', 'Наименование'],
      vals: ['Цена'],
    },
    {
      value: 'by_rootsection_section',
      label: 'Раздел + категория',
      cols: [],
      rows: ['Раздел', 'Категория'],
      vals: ['Цена'],
    },
    {
      value: 'by_day',
      label: 'Дата',
      cols: [],
      rows: ['Дата оплаты'],
      vals: ['Цена'],
    },
    {
      value: 'by_day_rootsection',
      label: 'Дата + раздел',
      cols: [],
      rows: ['Дата оплаты', 'Раздел'],
      vals: ['Цена'],
    },
    {
      value: 'by_day_rootsection_section',
      label: 'Дата + раздел + категория',
      cols: [],
      rows: ['Дата оплаты', 'Раздел', 'Категория'],
      vals: ['Цена'],
    },
    {
      value: 'by_day_rootsection_section_name',
      label: 'Дата + раздел + категория + товар',
      cols: [],
      rows: ['Дата оплаты', 'Раздел', 'Категория', 'Наименование'],
      vals: ['Цена'],
    },
  ]
}

export function basketItemsFilled(state, getters, rootState) {
  return (items) => {

    return items.map(item => {

      const result = {
        ...item
      }


      if (result.QUANTITY > 10000) {
        result.QUANTITY = 1
        result.FINAL_PRICE = 1
        result.FINAL_PRICE_BASE = 1
      }

      if (item.ORDER) {

        const order = item.ORDER

        result.BUYER_NAME = order.BUYER_NAME
        result.CONTRACT_NUM = order.CONTRACT_NUM
        result.EDU_GROUP_NUM = order.EDU_GROUP_NUM
        result.STUDENT_FIO = order.STUDENT_FIO

        result.PAID = order && order.IS_PAID ? 'да' : 'нет'

        if (order.IS_PAID && order.DATE_PAYED) {
          result.PAID_DATE_FORMATTED = timestampToFormat(order.DATE_PAYED, 'DD.MM.YYYY')
          result.PAID_DATE_YEAR = timestampToFormat(order.DATE_PAYED, 'YYYY')
          result.PAID_DATE_MONTH = timestampToFormat(order.DATE_PAYED, 'MMMM')
          result.PAID_DATE_DAY = timestampToFormat(order.DATE_PAYED, 'DD')
        } else {
          result.PAID_DATE_FORMATTED = 'не оплачено'
          result.PAID_DATE_YEAR = 'нет'
          result.PAID_DATE_MONTH = 'нет'
          result.PAID_DATE_DAY = 'нет'
        }

      }

      //console.log(item.ELEMENT)

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
      } else {
        result.ROOT_SECTION_NAME = 'раздел не найден'
      }

      if (result.SECTION) {
        result.SECTION_NAME = result.SECTION.NAME
      } else {
        result.SECTION_NAME = 'категория не найдена'
      }

      delete result.ELEMENT
      delete result.SECTION
      delete result.ROOT_SECTION

      return result;
    })
  }
}
