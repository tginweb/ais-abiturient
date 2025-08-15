<script>
import CProfile from "./inc/profile";
import query from "@tgin/sale/pub/gql/basket/mutation/actions.gql";

export default {
  components: {
    CProfile
  },
  props: {
    value: {},
    items: {}
  },
  data() {
    return {
      valueState: this.value
    }
  },
  computed: {},
  watch: {
    value() {
      this.valueState = this.value
    },
    valueState(val) {
      if (this.value !== val) {
        this.$emit('input', val)
      }
    },
  },
  async created() {

  },
  methods: {
    onCreate() {

      this.$router.push({
        name: 'ps.yookassa:auth',
        onResolve: async (action, item) => {
          await this.$store.dispatch('sale/fetchUserOrderProfiles')
          this.$emit('saved', 'create', item)
        }
      })
    },

    onDelete(item) {

      this.$q.dialog({
        title: 'Удаление',
        message: 'Вы действительно хотите удалить карту оплаты?',
        cancel: true,
        persistent: true
      }).onOk(async () => {

        try {

          const sid = await this.$store.dispatch('gql/mutation', {
            mutation: require('@tgin/sale/pub/gql/paycard/mutation/paycard_delete.gql'),
            variables: {
              sid: item.VALUE
            }
          })

          await this.$store.dispatch('sale_pub/fetchPaycards')

        } catch (e) {
          console.log(e)
        }

      })

    },

  }
}
</script>
<style lang="scss" scoped>


</style>
