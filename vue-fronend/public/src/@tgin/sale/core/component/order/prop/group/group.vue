<script>

export default {
  props: {
    group: {},
    excludeProps: {default: () => []},
    colFieldsStyle: {},
    modeView: {},
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
    }
  },
  computed: {
    propsComp() {
      return this.group.PROPS.filter(prop => this.excludeProps.indexOf(prop.CODE) === -1)
    }
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
