<script>
import CProfile from "./inc/profile";

export default {
  components: {
    CProfile
  },
  props: {
    value: {},
    items: {},
    personTypeId: {},
    allowSelect: {},
    allowAdd: {},
    addLabel: {default: 'Добавить адрес'},
    showPersonType: {default: true},
    showCompany: {default: true},
  },
  data() {
    return {
      valueState: this.value,
      fetching: false,
    }
  },
  computed: {
    selectedItem() {
      return this.items.find(item => item.ID === this.valueState)
    }
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
    this.$bus.on('entity.changed:order.profile', this.busProfileChanged)
  },
  beforeDestroy() {
    this.$bus.off('entity.changed:order.profile', this.busProfileChanged)
  },
  methods: {
    async busProfileChanged(args) {
      this.$emit('changed', args)
    },
    async onCreate() {
      this.$router.push({
        name: 'sale:profile.add',
        params: {}
      })
    },
    async onEdit(item) {
      this.$router.push({
        name: 'sale:profile.edit',
        params: {
          entityId: item.ID
        }
      })
    },
    async onDelete(item) {
      this.$q.dialog({
        title: 'Удаление',
        message: 'Вы действительно хотите удалить профиль?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.onDeleteCommit(item)
      })
    },
    async onDeleteCommit(item) {
      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('@tgin/sale/pub/gql/profile/mutation/profile_delete.gql'),
          variables: {
            ID: item.ID
          }
        })
        this.$emit('saved')
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>
<style lang="scss" scoped>


</style>
