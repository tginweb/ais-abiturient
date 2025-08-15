import timestampToFormat from "../../../../../../../../@tgin/main/common/lib/util/date/timestampToFormat";

export function statusById(state) {
  return state.app.statuses.reduce((map, obj) => (map[obj.id] = obj, map), {})
}

export function statusOptions(state) {
  return state.app.statuses.map(status => ({
    ...status,
    disable: !status.selectable
  }))
}

export function appStatusOptions(state) {
  return state.app.appStatuses.map(status => ({
    ...status,
    disable: !status.selectable
  }))
}


export function ordersPivoted(state, getters, rootState) {
  return (items) => {

    return items.map(item => {

      const result = {
        ...item
      }

      return result;
    })
  }
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
      value: 'level',
      label: 'Уровень образования',
      cols: [],
      rows: ['Уровень образования'],
      vals: ['Количество'],
    },
    {
      value: 'admission',
      label: 'Направление',
      cols: [],
      rows: ['Направление: наименоввние'],
      vals: ['Количество'],
    },
    {
      value: 'source',
      label: 'Основа',
      cols: [],
      rows: ['Основа'],
      vals: ['Количество'],
    },
  ]
}

export function pivotPresetsById(state, getters, rootState) {
  return getters.pivotPresets.reduce((map, obj) => (map[obj.value] = obj, map), {})
}
