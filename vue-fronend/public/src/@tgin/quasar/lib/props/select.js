export default {
  ...require('./field').default,
  hint: {},
  required: {default: false},
  multiple: {default: false},
  clearable: {default: false},
  behavior: {default: 'default'},
  options: {default: () => []},
  optionLabel: {
    default: 'label'
  },
  optionValue: {
    default: 'value'
  },
  mapOptions: {
    default: false
  },
  emitValue: {
    default: false
  },
  useChips: {
    default: false
  },
  hideDropdownIcon: {
    default: false
  }
}
