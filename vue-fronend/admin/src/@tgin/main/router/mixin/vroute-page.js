export default {
  components: {

  },
  props: {

    type: {default: 'page'},

    title: {},

    tabs: {default: () => []},
    tab: {default: null},

    toolbar: {default: () => []},
    toolbarExclude: {default: () => []},

    context: {default: () => ({})},

    loading: {default: false},
    loaded: {default: true},

    value: {},

    maximized: {default: false},

    backEnable: {default: true},

    orderRoot: {default: false},
    orderCurrent: {default: false},
    orderIndex: {default: 0},

    dialogMode: {default: 'drawer'},
    dialogWidth: {default: '448px'},
    dialogMaxWidth: {default: '80vw'},
    dialogMaxHeight: {default: '90vh'},

    actionsClose: {default: false},
    actionsClosePosition: {default: 'fixed'},

    actions: {default: () => []},
    menu: {},

    scrollHeight: {default: 0},
  },
  data() {
    return {
      valueState: this.value,
      bodyHeight: 0,
      bodyScrollHeight: this.scrollHeight,

      tabState: this.tab,
      dialogWidthState: this.dialogWidth
    }
  },
  computed: {


    actionsByPosition() {

      const res = this.actions.reduce((map, action) => {
        const pos = action.position || 'fixed'
        if (!map[pos]) map[pos] = []
        map[pos].push(action)
        return map
      }, {});

      if (this.type === 'dialog') {

        if (this.actionsClose && this.$q.screen.lt.md) {

          if (!res[this.actionsClosePosition]) res[this.actionsClosePosition] = []

          let btn = {
            label: 'Закрыть',
            callback: () => {
              this.valueState = false
            }
          }

          if (!this.isMobileSheet) {
            btn = {
              ...btn,
              color: 'primary-brown-1',
              textColor: 'dark'
            }
          } else {
            btn = {
              ...btn,
              color: 'dark',
              flat: true,
            }
          }

          res[this.actionsClosePosition].push(btn)
        }
      }

      return res
    },

  },
  watch: {
    tab(v) {
      this.tabState = v
    },
    tabState(v) {
      this.$emit('update:tab', v)
    },
    value(val) {
      this.valueState = val
    },
    valueState(val) {
      this.$emit('input', val)
    },

    bodyScrollHeight(v) {

      this.$emit('update:scrollHeight', v)
    }
  },
  methods: {
    onBack() {
      this.$router.go(-1)
    },

    onResize() {

      if (this.$refs.body) {
        this.bodyHeight = this.$refs.body.clientHeight
      }

      if (this.$refs.bodyScroll) {
        this.bodyScrollHeight = this.$refs.bodyScroll.$el.clientHeight
      }

    }
  },
  mounted() {
    this.onResize();
  }

}

