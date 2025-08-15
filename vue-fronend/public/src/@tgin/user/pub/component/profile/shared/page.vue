<template>
  <div>


  </div>
</template>

<script>


export default {
  props: {
    header: {default: true},
    title: {},
    path: {},
    loading: {default: false},
    loaded: {default: true},
    actions: {default: () => []},
  },
  data() {
    return {
      activeMenuItemTab: null
    }
  },
  methods: {
    onMenuItemClick(item) {
      if (item.callback) {
        item.callback()
      } else if (item.url) {
        this.$router.push(item.url, ()=>{}, ()=>{})
      }
    },
  },
  watch: {
    activeMenuItemUrl: {
      handler: function (url) {
          this.activeMenuItemTab = url
      },
      immediate: true
    },
  },
  computed: {

    menuItems() {
      return this.$store.getters['menu/menusItems']['personal'].filter(item => !item.params.page_hide)
    },

    activeMenuItem() {
      return this.menuItems.find(item => item.url === this.$route.path) || (this.path && this.menuItems.find(item => !!this.path.slice(1).find(pathItem => pathItem.url === item.url)))
    },

    activeMenuItemUrl() {
      return this.activeMenuItem && this.activeMenuItem.url
    },

    actionsByPosition() {

      const res = this.actions.reduce((map, action) => {

        let pos = action.position || 'bottom'

        if (pos === 'fixed') {
          pos = 'bottom'
        }

        if (!map[pos]) map[pos] = []
        map[pos].push(action)
        return map
      }, {});

      if (this.actionsClose && this.$q.screen.lt.md) {

        if (!res[this.actionsClosePosition]) res[this.actionsClosePosition] = []


        res[this.actionsClosePosition].push(btn)
      }

      return res
    },

  }
}

</script>

<style lang="scss" scoped>


</style>
