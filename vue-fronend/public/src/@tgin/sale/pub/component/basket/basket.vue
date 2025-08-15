<template>
  <div class="basket">

  </div>
</template>

<script>
import CBasketItemDesktop from './item/item.desktop'
import CBasketItemMobile from './item/item.mobile'

export default {
  components: {
    CBasketItemDesktop,
    CBasketItemMobile,
  },
  props: {
    summaryShow: {default: true},
    usedHeight: {default: 0},
  },
  data() {
    return {
      vorderRefetch: false,
      requestState: {
        process: false,
        fetching: false,
        fetched: false,
      },
      scrollHeight: 100,
      showingVesTooltip: false,
      summaryIntersect: false,
      isMounted: false,

    }
  },
  created() {
    if (this.vorderRefetch) {
      this.$store.commit('sale_pub/BASKET_WITH_VORDER', true)
    }
  },
  beforeDestroy() {
    if (this.vorderRefetch) {
      this.$store.commit('sale_pub/BASKET_WITH_VORDER', false)
    }
  },
  methods: {
    scrollHandler(info) {
      this.showingVesTooltip = false
    },

    onSummaryIntersect(info) {
      this.summaryIntersect = info.isIntersecting
    },

    onNavOrder() {
      if (ym)
        ym(8821120, 'reachGoal', 'Oform');

      this.$router.push('/order')
    },

    onResize() {
        if (this.$refs.items) {

          const rect = this.$refs.com.getBoundingClientRect()

          const itemsTop = parseInt(rect.y)
          const itemsHeight = this.$refs.items.clientHeight
          const bottomHeight = this.$refs.bottom ? this.$refs.bottom.clientHeight : 0
          const windowHeight = window.innerHeight

          const maxHeight = windowHeight - itemsTop - bottomHeight - this.usedHeight - 50;

          //console.log([windowHeight, itemsTop, bottomHeight, this.usedHeight])

          let height = itemsHeight > maxHeight ? maxHeight : itemsHeight

          this.scrollHeight = height
        }
    },

    async fetch() {
      await this.$store.dispatch('sale_pub/basketFetch', {params: {recalc: true}, state: this.requestState})
    },

    onItemComment(itemId, comment) {
      this.$store.dispatch('sale_pub/basketOp', [
        'comment',
        {
          itemId: itemId,
          comment: comment,
        }
      ])
    },

    onItemCommentRemove(itemId, comment) {
      this.$store.dispatch('sale_pub/basketOp', [
        'comment',
        {
          itemId: itemId,
          comment: '',
        }
      ])
    },

    onItemQuantity(itemId, quantity) {
      this.basketQuantitySetDebounced(itemId, quantity);
    },

    onItemRemove(itemId) {
      this.$store.dispatch('sale_pub/basketOp', [
        'remove',
        {
          itemId: itemId,
        }
      ])
    },

    basketQuantitySet(itemId, quantity) {
      this.$store.dispatch('sale_pub/basketOp', [
        'quantity-set',
        {
          itemId: itemId,
          quantity: quantity,
        }
      ])
    },

    onBasketChanged() {
      console.log('onBasketChanged')

      this.$store.dispatch('sale_pub/vorderFetch')
    },
  },
  computed: {
    onResizeDebounced() {
      return this.$util.base.debounce(this.onResize, 50)
    },
    basketIsEmpty() {
      return !this.$store.getters['sale_pub/basketCount']
    },
    basketQuantitySetDebounced() {
      return this.basketQuantitySet
      //return this.$util.base.debounce(this.basketQuantitySet, 800)
    },
    basket() {
      return this.$store.getters['sale_pub/basketData']
    },
    basketItems() {
      return this.$store.getters['sale_pub/basketItems']
    },
    vorderData() {
      return this.$store.getters['sale_pub/vorderData']
    },
    vorderPropsValue() {
      return this.$store.getters['sale_pub/vorderPropsValueByCode']
    }
  },
  watch: {
    '$q.screen.height'(v) {
      this.onResizeDebounced()
    }
  },
  mounted() {
    this.isMounted = true
    this.$nextTick(() => {
      this.onResizeDebounced()
    })
  }
}
</script>

<style lang="scss" scoped>

.c-items {
  border: 1px solid #ddd;
}

.c-item {
  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
}

.c-items-mobile {
}

.c-item-mobile {
  &:not(:last-child) {
    border-bottom: 1px solid #EFEEEE;
  }
}


@media (max-width: $breakpoint-sm-max) {

  .c-summary {
    border-top: 1px solid #EFEEEE;
  }
}

@media (min-width: $breakpoint-md-min) {

  .c-summary {
    border: 1px solid #ddd;

    .c-summary__info {
      border-bottom: 1px solid #ddd;
    }

    .c-summary__freedeliver {
      border-bottom: 1px solid #ddd;
    }
  }
}

</style>
