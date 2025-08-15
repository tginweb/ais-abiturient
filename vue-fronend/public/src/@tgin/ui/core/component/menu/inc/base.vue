<script>


export default {
  components: {},
  props: {
    items: {},
    excludeCurrent: {},
  },
  data() {
    return {}
  },
  computed: {

    itemsComp() {
      return this.items && this.items.filter((item) => {
        if (this.excludeCurrent) {
          if (this.$route.fullPath === item.URL) return false
        }
        return true
      })
    },

    itemsBinds() {
      return this.itemsComp.map((item) => {
        const res = {}
        if (item.URL)
          res.to = item.URL
        return res
      })
    },
  },

}
</script>

<style lang="scss" scoped>


</style>
