<script>

import CStatuses from './inc/statuses'
import CActions from './inc/actions'
import CFields from './inc/fields'
import CBasket from './inc/basket'
import CPayments from './inc/payments'
import MOrder from '@tgin/sale/core/mixins/order'

export default {
  components: {
    CStatuses,
    CActions,
    CFields,
    CBasket,
    CPayments
  },
  mixins: [MOrder],
  computed: {

  }
}
</script>

<style lang="scss" scoped>


</style>
