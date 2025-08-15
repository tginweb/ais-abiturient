<script>
import CItem from "./inc/item";

export default {
  components: {
    CItem
  },
  props: {
    value: {},
    items: {}
  },
  data() {
    return {
      valueState: this.value,
      fetching: false,
    }
  },
  computed: {
    itemsComp() {
      return (this.items || []).map(item => {
        const citem = {
          ...item,
          PROP_VAL: item.PROPS && item.PROPS.reduce((map, obj) => (map[obj.CODE] = obj.VAL, map), {})
        }
        return citem
      })
    },
    selectedItem() {
      return this.items.find(item => item.ID === this.valueState)
    }
  },
  methods: {
    async busProfileChanged(args) {
      this.fetching = true
      await this.$store.dispatch('sale_pub/fetchUserBuyerCompanies')
      this.$emit('changed', args)
      this.fetching = false
    },

    async onCreate() {
      this.$router.push({name: 'sale:buyer.company.add'})
    },
    async onView(item) {
      this.$router.push({name: 'sale:buyer.company.view', params: {entityId: item.ID}})
    },
    async onEdit(item) {
      this.$router.push({name: 'sale:buyer.company.edit', params: {entityId: item.ID}})
    },
    async onDelete(item) {
      this.$store.dispatch('sale_pub/deleteUserBuyerCompany', {id: item.ID})
    },
  },
  watch: {
    value() {
      this.valueState = this.value
    },
    valueState(val) {
      this.$emit('input', val)
    },
  },
  created() {
    this.$bus.on('entity.changed:buyer-company', this.busProfileChanged);
  },
  beforeDestroy() {
    this.$bus.on('entity.changed:buyer-company', this.busProfileChanged);
  },
}
</script>
<style lang="scss" scoped>


</style>
