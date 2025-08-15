<template>
  <div class="query-item">

    <div class="row q-col-gutter-lg">

      <div class="col-24 col-md-12" >

        <div class="i-media q-mt-xs">

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
                  <span class="q-pr-xs">NEW</span>
                </div>
              </div>

            </div>

            <div class="i-favs q-ml-auto">

              <q-btn
                  :icon="inFavorites ? $icons.favoriteFilled : $icons.favorite"
                  color="primary-brown-gray-2"
                  dense
                  flat
                  @click="onFavToggle"
              />

            </div>

          </div>

          <div class="i-thumb text-center">
              <img
                  v-if="itemListImage"
                  :src="$image.resolveUrl(itemListImage.SRC, 'r400')"
                  class="i-thumb-img"
                  style="max-height: 200px; width: auto;"
              />
          </div>

        </div>

      </div>

      <div class="col-24 col-md-12 flex column">

        <div
            class="s-font-4xl"
            style="font-weight:600;"
            v-if="$q.screen.gt.md"
        >{{itemTitle}}</div>

        <div v-if="propVal.VES_UPAKOVKI_1" class="s-font-2xl" style="font-size: 15px; color: #777;">
          {{ propVal.VES_UPAKOVKI_1 }}
        </div>

        <div class="i-country q-mt-xs text-primary-brown-gray-4 s-font-xs s-font-xs-md ">
          {{ propVal.STRANA_PROISKHOZHDENIYA }}
        </div>

        <div class="i-teaser q-mt-md" v-html="descTeaser">

        </div>

        <div class="flex q-gutter-x-md q-mt-md">

          <q-btn
              v-if="discountPercent"
              :label="'-' + discountPercent + '%'"
              class="i-meta__item i-discount-percent --dense-2 "
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
              unelevated
              title="Рейтинг"
              @click="$util.dom.scrollTo({el: '.c-reviews', offset: 80, duration: true})"
          >
            <q-icon :name="$icons.star" class="q-mr-xs" size="16px"/>
            <span>{{ propVal.RATING }}</span>
          </q-btn>

          <q-btn
              v-if="propVal.RATING_VOTES"
              class="i-meta__item i-reviews --dense-2"
              color="primary-brown-1"
              dense
              title="Количество отзывов"
              text-color="dark"
              unelevated
              @click="$util.dom.scrollTo({el: '.c-reviews', offset: 80, duration: true})"
          >
            <q-icon :name="$icons.comment" class="q-mr-xs" size="14px"/>
            <span>{{ propVal.RATING_VOTES }}</span>
          </q-btn>

        </div>

        <div class="i-catalog flex items-end q-mt-lg">

          <div v-if="entity.PRICE && entity.PRICE.PRICE" class="i-price leading-none flex">

            <div
                :class="{
                    'i-price__discounted s-font-4xl leading-none text-weight-bold': true,
                    'text-actions-red': !!discountPercent
                }"
                style="margin-bottom:-5px;"
            >
              {{ measurePriceDiscounted | price }}
            </div>


            <div v-if="discountPercent" class="i-price__base  q-ml-xs q-pl-sm q-mt-auto text-strike">
              {{ measurePriceBase | price }}
            </div>


          </div>

          <div
              v-if="entity.MEASURE"
              class="i-measure text-grey-6 leading-none q-ml-md"
          >

            цена за {{ measureRatio }} {{ measureName }}

          </div>

        </div>

        <div class="i-sale q-mt-lg q-pt-sm" v-if="isMounted">

          <template v-if="!inBasket">

            <div class="flex">

              <q-btn
                  class="q-px-2lg  s-font-md"
                  color="primary"
                  label="Добавить в корзину"

                  unelevated
                  @click="onBasketAdd"
              />

            </div>

          </template>
          <template v-else>

            <sale-basket-item-quantity
                v-model="basketQuantityInput"
                :measureName="measureName"
                :measureRatio="measureRatio"
                class="c-quantity"
            />

          </template>

        </div>

      </div>

    </div>


  </div>
</template>

<script>
import CParent from './product-element-detail-base'

export default {
  extends: CParent,
  components: {},
  computed: {

  },
  data() {
    return {

    }
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>

.query-item {

}

.i-content {

}

.i-header {

}

.i-thumb-img {

}


.i-image-slide {
  outline: none;
}

.i-info__section {
  border-top: 1px solid #EFEEEE;
}

.i-info__section__inner {
  max-width: 830px;
}

.c-reviews {
  max-width: 735px;
}

.c-slider {
  /deep/ {
    .slick-prev {
      left: 0;
      z-index: 1;
    }

    .slick-next {
      right: 0;
      z-index: 1;
    }
  }
}

.c-slider-thumbs {
  /deep/ {
    .slick-slide {
      border: 1px solid #EFEEEE;
      height: 64px;
      line-height: 0;
      margin-right: -1px;
      margin-bottom: 0px;
      margin-left: -1px;
      outline: none;


      img {
        max-height: 96%;
        width: auto;
        margin: auto;
        display: block;
      }

      &.slick-current {
        border: 1px solid #20796C;
        position: relative;
        margin-left: 0px;
      }
    }
  }
}

.c-slider-thumb {
  height: 63px;
  outline: none;
  display: flex !important;
}

.c-quantity {
  max-width: 250px;
}


.i-headline {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1;
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
