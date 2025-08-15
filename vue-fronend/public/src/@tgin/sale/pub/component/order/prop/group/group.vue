<script>

export default {
  props: {
    group: {},
    excludeProps: {default: () => []},
    colFieldsStyle: {},
    readonly: {},
    dialog: {},
    dialogActions: {},
    value: {},
    loading: {},
    filled: {default: null}
  },
  inject: [
    'bindPropInput',
    'onPropInput',
    'onPropChange',
    'onPropChangeMultiple',
    'propIf',
    'propByRole',
    'propsUpdateByRole'
  ],
  data() {
    return {
      valueState: this.value,
      //dialogActionsState: this.dialogActions
    }
  },
  computed: {
    propsComp() {
      return []
    },
    dialogActionsComp() {

      const res = []

      Array.prototype.push.apply(res, this.dialogActions)

      if (!res.length) {
        res.push({
          label: this.filled === null || this.filled === true ? 'Готово' : 'Закрыть',
          color: 'primary',
          callback: () => {
            this.valueState = false
          }
        })
      }

      return res
    }
  },
  watch: {
    value(value) {
      this.valueState = value
    },
    valueState(value) {
      this.$emit('input', value)
    },
  },
  methods: {
    onInput(prop, value) {
      this.onPropInput(prop.ID, value)
    },
    onChange(prop, value) {
      this.onPropChange(prop.ID, value)
    },
    onChangeMultiple(props) {
      this.onPropChangeMultiple(props)
    },
  }
}
</script>

<style lang="scss" scoped>

@media (max-width: $breakpoint-md-max) {
  .com-props-group {
    margin-bottom: 10px !important;
  }
  .c-name {
    font-weight: bold;
  }
}

</style>
