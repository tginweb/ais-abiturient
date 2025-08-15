<template>
  <div
      v-bind="bindType"
      class="element"
      @mousedown="onMouseover"
      @mouseover="onMouseover"
      @mouseleave="onMouseleave"
      :class="{
          expandable: expandable,
          hover: hover
      }"
  >
    <div class="i-content q-pa-md" style="position:relative;">

      <div class="i-base">

        <div class="i-media q-mb-xs">

          <q-btn
              icon="visibility"
              flat
              size="17px"
              color="primary"
              style="opacity1:0.7;position: absolute;bottom:0;left:0;"
              label="быстрый просмотр"
              dense
              v-if="hover && false"
              @click="onNavPopup"
          />

          <div class="i-headline flex">

            <div class="i-flags inline-block ">

              <div
                  v-for="(flag, index) of flags"
                  v-if="index < flagsLimit"
                  class="i-flag leading-none q-mb-sm"
              >
                <div
                    :class="{
                  'i-flag__inner text-white q-pl-sm q-pr-md q-py-xs': true,
                  ['bg-'+flag.COLOR]: true
                }"
                >
                  <span class="q-pr-xs">{{ flag.NAME }}</span>
                </div>
              </div>

            </div>

            <div class="i-favs q-ml-auto">

              <q-btn
                  :icon="inFav ? $icons.favoriteFilled : $icons.favorite"
                  color="primary-brown-gray-2 bg-white"
                  dense
                  flat
                  @click="onFavToggle"
              />

            </div>

          </div>

          <div
              class="i-thumb q-mb-sm"
              v-if="itemListImage"
          >
            <component
                v-bind="bindLink"
                @click.native.prevent="onNavDetail"
                event=""
            >
              <div
                  v-lazy:background-image="$image.resolveUrl(itemListImage.SRC, 'r400')"
                  class="i-thumb-img"
              >
              </div>
            </component>
          </div>
          <div
              class="i-thumb q-mb-sm"
              v-else
          >
            <component
                v-bind="bindLink"
                @click.native.prevent="onNavDetail"
                event=""
            >
              <div
                  v-lazy:background-image="'/upload/iblock/98f/98f61d51cf769614c925ec72e672828a.jpg'"
                  class="i-thumb-img"
              >
              </div>
            </component>
          </div>

        </div>

        <div class="i-info">

          <div
              class="i-meta flex q-gutter-x-xs q-mb-sm s-font-xs s-font-xs-md"
              v-if="discountPercent || propVal.RATING"
          >

            <q-btn
                v-if="discountPercent"
                :label="'-' + discountPercent + '%'"
                class="i-meta__item i-discount-percent --dense-2"
                color="actions-red"
                dense
                unelevated
            />

            <q-btn
                v-if="propVal.RATING"
                class="i-meta__item i-rating --dense-2"
                color="primary-brown-1"
                dense
                text-color="dark"
                title="Рейтинг"
                unelevated
                @click="onNavRating"
            >
              <q-icon :name="$icons.star" class="q-mr-xs" size="16px"/>
              <span>{{ propVal.RATING }}</span>
            </q-btn>

            <q-btn
                v-if="propVal.RATING_VOTES"
                class="i-meta__item i-reviews --dense-2"
                color="primary-brown-1"
                dense
                text-color="dark"
                title="Количество отзывов"
                unelevated
                @click="onNavRating"
            >
              <q-icon :name="$icons.comment" class="q-mr-xs" size="14px"/>
              <span>{{ propVal.RATING_VOTES }}</span>
            </q-btn>

          </div>

          <component
              v-bind="bindLink"
              class="i-header block q-mb-md"
              @click.native.prevent="onNavDetail"
              event=""
          >

            <h3 class="i-title s-font-xs s-font-xs-md leading-snug q-ma-none">

              {{ offer.NAME }}

              <span v-if="propVal.VES_UPAKOVKI_1" class="q-ml-xs" style="font-size: 15px; color: #777;">
               {{ propVal.VES_UPAKOVKI_1 }}
              </span>

            </h3>

            <div class="i-country q-mt-xs text-primary-brown-gray-4 s-font-xs s-font-xs-md "
                 v-if="propVal.STRANA_PROISKHOZHDENIYA">
              {{ propVal.STRANA_PROISKHOZHDENIYA }}
            </div>

          </component>

        </div>
      </div>

      <div class="i-end q-mt-auto">

        <div class="i-trade">

          <div v-if="offer.PRICE && offer.PRICE.PRICE">

            <div v-if="false && entity.MEASURE" class="i-measure text-grey-6 leading-none q-mb-sm">
              за {{ measureRatio }} {{ measureName }}
            </div>

            <div class="flex items-center q-gutter-sm">

              <div class="i-price leading-none flex items-center q-mr-auto">

                <div
                    :class="{
                      'i-price__discounted s-font-xl s-font-md-3xl  leading-none text-weight-bold q-mr-xs q-pr-sm': true,
                      'text-actions-red': !!discountPercent
                    }"
                >
                  {{ measurePriceDiscounted | price }}
                </div>

                <div v-if="discountPercent" class="i-price__base  q-mt-auto text-strike">
                  {{ measurePriceBase | price }}
                </div>

              </div>

              <div class="i-sale" style="min-height:34px;">

                <q-btn
                    class="q-px-xs --normal c-nav-detail lt-md"
                    color="primary"
                    dense
                    size="16px"
                    @click="onNavDetail"
                    outline
                    label="подробнее"
                    v-if="isOffersParent && !offersShow"
                />

                <q-btn
                    :icon="$icons.basket"
                    class="q-px-xs q-py-xs --icon-only"
                    color="primary"
                    dense
                    size="16px"
                    unelevated
                    @click="onBasketAdd"
                    v-else-if="!inBasket"
                />

                <sale-basket-item-quantity
                    v-model="basketQuantityInput"
                    :measureName="measureName"
                    :measureRatio="measureRatio"
                    class="i-quantity"
                    color="primary"
                    text-color1="white"
                    size="16px"
                    :outline="true"
                    :flat="true"
                    v-else
                    :show-measure="true"
                    input-class="border-primary border-1 border-radius-xs"
                />

              </div>

            </div>

          </div>
          <div v-else>

            <q-btn
                :to="'/catalog/product/' + offer.ID + '/order'"
                class="q-px-xs q-py-xs full-width"
                color="primary-brown-1"
                dense
                label="заказать"
                text-color="dark"
                unelevated
            />

          </div>
        </div>

        <div class="i-expand-box-base">
          <div class="">
          </div>
        </div>

        <div
            v-if="isMounted && isOffersParent && offersShow"
            class="i-bottom q-pt-sm q-pt-mt-md"
        >

          <div class="q-pb-md">
            <COffersTree
                :entity="entity"
                v-if="isOffersParent"
                @offer="offerId = $event"
            />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import CParent from '@tgin/ui/core/component/entity/entity-element'
import COffersTree from './offer/offers-tree'

export default {
  extends: CParent,
  components: {
    COffersTree
  },
  props: {
    borderStyle: {default: 'all'},
    saleModule: {default: 'sale_pub'},
    expandable: {default: true},
    offersShow: {default: true},
    iblock: {default: null},
  },
  data() {
    const entity = this.entity || this.entityData
    return {
      tx: '33',
      basketQuantity: 0,
      flagsLimit: 1,
      isMounted: false,
      hover: false,
      offerId: entity && entity.OFFERS && entity.OFFERS.length ? entity.OFFERS[0].ID : null,
      basketProps: {
        GIFT: null,
        CONSTRUCTOR: {}
      },
      basketLastAction: {
        op: null,
        tooltip: false,
        message: null
      },
    }
  },
  computed: {

    clientHash() {
      return JSON.stringify(this.basketProps)
    },

    gifts() {
      return []
    },

    offer() {
      if (this.isOffersParent) {
        return this.entity.OFFERS.find(offer => offer.ID === this.offerId)
      } else {
        return this.entity
      }
    },

    isOffersParent() {
      return this.entity && this.entity.OFFERS && this.entity.OFFERS.length
    },

    bindType() {
      const res = this.bind

      res.class['--border-style-' + this.borderStyle] = true;

      return res;
    },

    canBuy() {
      return this.isAvailable
    },

    isAvailable() {
      return this.offer.CATALOG_AVAILABLE && this.offer.CATALOG_CAN_BUY && (this.measurePriceDiscounted > 0)
    },

    basketPropsFilled() {
      const res = {}
      for (const [propCode, propValue] of Object.entries(this.basketProps)) {
        if (propValue) {
          res[propCode] = propValue
        }
      }
      return res
    },

    basketPropsFilledHash() {
      return this.generatePropsHash(this.basketPropsFilled)
    },

    basketItems() {
      return this.entity && this.offer && this.$store.getters[this.saleModule + '/basketItemsByProductId'] && this.$store.getters[this.saleModule + '/basketItemsByProductId'][this.offer.ID] || []
    },

    basketItem() {
      return this.basketItems.find(item => {
        return !item.INPUT_PROPS_HASH || item.INPUT_PROPS_HASH === this.basketPropsFilledHash
      })
    },

    inBasket() {
      return !!this.basketItem
    },

    favItems() {
      return this.entity && this.offer && this.$store.getters[this.saleModule + '/favsByProductId'] && this.$store.getters[this.saleModule + '/favsByProductId'][this.offer.ID] || []
    },

    favItem() {
      return this.favItems[0]
    },

    inFav() {
      return !!this.favItem
    },

    flags() {
      return this.offer.FLAGS || []
    },

    measureName() {
      return this.offer.MEASURE.NAME || 'шт'
    },
    measureRatio() {
      return this.offer.MEASURE.RATIO || 1
    },
    measureRatioDights() {
      if (Math.floor(this.measureRatio) === this.measureRatio) return 0;
      return this.measureRatio.toString().split(".")[1].length || 0;
    },

    priceBase() {
      let price
      if (this.propVal.PRICE_OLD_1 && (this.propVal.PRICE_OLD_1 > this.offer.PRICE.PRICE)) {
        price = this.propVal.PRICE_OLD_1
      } else {
        price = this.offer.PRICE.PRICE
      }
      return price
    },

    priceDiscounted() {
      return this.offer.PRICE.DISCOUNTED
    },

    measurePriceBase() {
      return Math.round(this.priceBase * this.measureRatio)
    },

    measurePriceDiscounted() {
      return Math.round(this.priceDiscounted * this.measureRatio)
    },

    discountPercent() {
      if (this.priceBase !== this.priceDiscounted) {
        return 100 - Math.round((this.priceDiscounted / this.priceBase) * 100)
      } else {
        return 0
      }
    },

    basketQuantityInput: {
      get: function () {
        return this.basketQuantity && this.basketQuantity.toFixed(this.measureRatioDights)
      },
      set: function (val) {
        if (val < this.measureRatio) {

          if (this.basketItem) {

            this.setBasketLastAction('remove', 'Товар удален из корзины')

            this.$store.dispatch(this.saleModule + '/basketOp', ['remove', {
              itemId: this.basketItem.ID,
            }])
          }

        } else {
          this.basketQuantity = parseFloat(val)
          this.basketQuantitySetDebounced();
        }
      }
    },

    basketQuantitySetDebounced() {
      return this.basketQuantitySet
      //return this.$util.base.debounce(this.basketQuantitySet, 800)
    },
  },

  created() {
    if (this.basketItem)
      this.basketQuantity = this.basketItem.QUANTITY
  },
  methods: {
    generatePropsHash(data) {
      const res = []

      for (const [key, val] of Object.entries(data)) {
        if (val) {
          if (Array.isArray(val)) {
            res.push(key + '=[' + this.generatePropsHash(val) + ']')
          } else if (typeof val === 'object') {
            if (Object.keys(val).length) {
              res.push(key + '=[' + this.generatePropsHash(val) + ']')
            }
          } else {
            res.push(key + '=' + val)
          }
        }
      }
      return res.join(',')
    },

    onMouseover() {
      if (this.$q.screen.gt.md)
        this.hover = true
    },

    onMouseleave() {
      if (this.$q.screen.gt.md)
        this.hover = false
    },

    onNavDetail(e) {

      if (this.$q.screen.gt.md) {
        this.$router.push({path: this.compUrl})
      } else {
        this.onNavPopup()
      }
    },

    onNavPopup() {
      this.$router.push('/catalog/element-popup/' + this.entity.ID)
    },

    onNavRating() {
      this.$router.push(this.compUrl + '#reviews')
    },

    basketQuantitySet() {
      const params = {
        productId: this.offer.ID,
        basketItem: this.basketItem && this.basketItem.ID,
        quantity: this.basketQuantity,
        initiatorId: this.comId
      }

      if (this.basketItem) {
        params.itemId = this.basketItem.ID
      }

      this.$store.dispatch(this.saleModule + '/basketOp', ['quantity-set', params])
    },

    basketQuantityInputKeydown(e) {
      const charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
      const charStr = String.fromCharCode(charCode);
      if (!/[\d\.]/.test(charStr)) {
        e.preventDefault();
      }
    },

    setBasketLastAction(op, message) {
      this.basketLastAction.op = op
      this.basketLastAction.message = message
      this.basketLastAction.tooltip = true
      setTimeout(() => {
        this.basketLastAction.tooltip = false
      }, 1000)
    },

    async onBasketAddCommit() {
      this.setBasketLastAction('add', 'Товар добавлен в корзину')
      await this.$store.dispatch(this.saleModule + '/basketOp', ['add', {
        productId: this.offer.ID,
        quantity: this.measureRatio,
        props: this.basketProps,
        initiatorId: this.comId
      }])
    },

    async onBasketAdd() {
      try {
        if (this.$refs.form) {
          if (await this.$refs.form.validate())
            await this.onBasketAddCommit()
        } else {
          await this.onBasketAddCommit()
        }
      } catch (e) {
      }
    },

    async onSocialShare() {

      const query = {
        url: this.entity.URL,
        title: this.entity.NAME,
        image: this.entity.LIST_IMAGE.SRC
      }

      this.$router.push({name: 'social:share', query})
    },

    async onFavToggle() {

      if (!this.$store.getters['user/authorized']) {
        this.$store.dispatch('user/showNeedAuthAlert')
        return;
      }

      if (this.inFav) {
        await this.$store.dispatch(this.saleModule + '/favOp', {
          action: 'remove',
          itemId: this.favItem.ID,
          productId: this.offer.ID,
          props: this.basketProps
        })
      } else {
        await this.$store.dispatch(this.saleModule + '/favOp', {
          action: 'add',
          productId: this.offer.ID,
          props: this.basketProps
        })
      }
    },

  },
  watch: {
    basketItem: {
      handler: function (item) {
        if (item)
          this.basketQuantity = parseFloat(item.QUANTITY)
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {

    this.isMounted = true
  }
}
</script>

<style lang="scss" scoped>

.i-headline {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

.element {

  & {
    border: 1px solid #e8e8e8;
    margin-right: -1px;
    margin-bottom: -1px;
  }

  &.--border-style-y {
    border-right: 1px solid #e8e8e8;
    margin-right: -1px;
  }

  .i-base {
    position: relative;
    z-index: 4;
  }

  .i-trade {
    z-index: 4;
    position: relative;
  }

  &.expandable {

    @media (min-width: $breakpoint-md-max) {

      .i-expand-box-base {
        position: absolute;
        display: none;
        top: -11px;
        right: -11px;
        left: -11px;
        bottom: -11px;
        box-shadow: 0 16px 32px rgba(27, 30, 37, 0.2);
        border: 1px solid #F2F2F2;
        z-index: 3;

        div {
          border: 15px solid #fff;
          width: 100%;
          height: 100%;
        }
      }

      .i-bottom {
        display: none;
        box-shadow: 0 30px 32px rgba(27, 30, 37, 0.2);
        border: 1px solid #F2F2F2;
        border-top: 0;
        right: -11px;
        left: -11px;
        z-index: 5;
        position: absolute;
        top: 100%;
        background: #fff;
        padding: 0 24px 0 24px;
      }

      &.hover {

        .i-expand-box-base {
          display: block;
        }

        .i-bottom {
          display: block;
        }
      }
    }

  }

  &.hover {
    .c-nav-detail {
      display: block !important;
    }
  }

}

.i-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

}

.i-header {
  min-height1: 63px;
}

.i-thumb-img {
  height: 145px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

@media (min-width: $breakpoint-md-max) {
  .i-thumb-img {
    height: 190px;
  }
}

.i-flag {

  .i-flag__inner {
    position: relative;
    display: inline-block;

    &:after {
      content: " ";
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      z-index: 1;
      border-top: 12px solid transparent;
      border-right: 8px solid #FFF;
      border-bottom: 12px solid transparent;

      @media (max-width: $breakpoint-md-max) {
        border-top: 11px solid transparent;
        border-right: 7px solid #FFF;
      }
    }
  }
}


</style>
