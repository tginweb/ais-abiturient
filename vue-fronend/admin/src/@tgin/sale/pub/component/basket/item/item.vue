<template>
  <div class="com">


  </div>
</template>

<script>

import CItemQuantity from './quantity'

export default {
  props: {
    item: {},
    context: {},
    dropdown: {default: false}
  },
  components: {
    CItemQuantity
  },
  data() {
    return {
      selected: false,
      quantityState: this.item.QUANTITY,
      commentState: this.item.COMMENT,
      commentEnable: !!this.item.COMMENT,
      commentDialog: false
    }
  },
  watch: {
    'item.QUANTITY'(val) {
      this.quantityState = val
    },
    'item.COMMENT'(val) {
      this.commentState = val
    },
    commentEnable(val) {
      if (!val) {
        this.$emit('comment', this.item.ID, '')
      }
    }
  },
  computed: {

    propValue() {
      return this.item.PROPS.reduce((map, obj) => (map[obj.CODE] = obj.VALUE, map), {})
    },

    prop() {
      return this.item.PROPS.reduce((map, obj) => (map[obj.CODE] = obj, map), {})
    },

    favItems() {
      return this.$store.getters['sale_pub/favsByProductId'] && this.$store.getters['sale_pub/favsByProductId'][this.item.PRODUCT_ID] || []
    },

    favItem() {
      return this.favItems[0]
    },

    inFav() {
      return !!this.favItem
    },

    quantityInput: {
      get: function () {
        return this.quantityState
      },
      set: function (val) {

        if (val < this.measureRatio) {
          this.$emit('remove', this.item.ID)
        } else {
          this.quantityState = parseFloat(val)
          this.$emit('quantity', this.item.ID, this.quantityState)
        }
      }
    },
    element() {
      return this.item.ELEMENT
    },

    elementImage() {
      return this.element && this.element.LIST_IMAGE
    },

    flags() {
      return [
        {'NAME': 'часто берут'}
      ]
    },

    itemPriceDiscount() {
      return this.itemPrice - this.itemPriceBase
    },

    itemFinalPriceDiscount() {
      return this.item.FINAL_PRICE_COMP - this.item.FINAL_PRICE_BASE_COMP
    },


    itemPrice() {
      return this.item.PRICE * this.measureRatio
    },

    itemPriceBase() {
      return Math.round(this.item.PRICE_BASE * this.measureRatio)
    },

    measureName() {
      return this.element && this.element.MEASURE.NAME || 'кг'
    },
    measureRatio() {
      return this.element && this.element.MEASURE.RATIO || 1
    },
    measurePriceBase() {
      return this.element ? Math.round(this.element.PRICE.PRICE * this.measureRatio) : null
    },
    measurePriceDiscounted() {
      return this.element ? Math.round(this.element.PRICE.DISCOUNTED * this.measureRatio) : null
    },
    measureRatioDights() {
      if (Math.floor(this.measureRatio) === this.measureRatio) return 0;
      return this.measureRatio.toString().split(".")[1].length || 0;
    },
  },

  methods: {

    onCommentBlur() {
      this.$emit('comment', this.item.ID, this.commentState)
    },

    onFavToggle() {
      if (!this.inFav) {
        this.$store.dispatch('sale_pub/favOp', {
          action: 'add',
          basketId: this.item.ID,
        })
      } else {
        this.$store.dispatch('sale_pub/favOp',  {
          action: 'remove',
          itemId: this.favItem.ID,
        })
      }
    },
  },

}
</script>

<style lang="scss" scoped>


</style>
