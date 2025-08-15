<template>
  <div v-bind="bind" class="query-item">


    <div class="i-head">

      <div class="row q-col-gutter-x-2lg q-col-gutter-y-lg">

        <div class="col-24 col-md-12 ">

          <div v-if="isMounted">

            <div
                class="c-slider border-1 border-primary-brown-gray-1 relative-position"
                v-if="gallery.length"
            >
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
                      color="primary-brown-gray-2"
                      dense
                      flat
                      title="Добавить в избранное"
                      @click="onFavToggle"
                  />

                </div>

              </div>

              <div class="q-px-lg">
                <slick-carousel
                    ref="sliderImages"
                    :adaptiveHeight="false"
                    :arrows="true"
                    :dots="false"
                    :focusOnSelect="true"
                    @beforeChange="onSliderChange"
                >
                  <div v-for="(url, index) of gallery" class="i-image-slide text-center">
                    <img :src="$image.resolveUrl(url, 'r800')"/>
                  </div>
                </slick-carousel>
              </div>

              <slick-carousel
                  ref="sliderThumbs"
                  :adaptiveHeight="false"
                  :arrows="false"
                  :dots="false"
                  :focusOnSelect="true"
                  :slidesToShow="6"
                  class="c-slider-thumbs"
                  @beforeChange="onSliderChange"
              >
                <div
                    v-for="(url, index) of gallery"
                    :class="{
                  'c-slider-thumb text-center ': true,
                }"
                >
                  <img :src="$image.resolveUrl(url, 'r800')"/>
                </div>
              </slick-carousel>

            </div>

          </div>

        </div>

        <div class="col-24 col-md-12">


          <h1 class="i-title s-font-6xl leading-snug q-ma-none font-tenor-sans">
            {{ itemTitle }}
          </h1>

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

    <div class="i-info q-mt-xl">

      <div v-if="descAbout || descSostav || descCook" class="i-info__header text-weight-bold q-pb-sm">
        Описание
      </div>

      <div v-if="descAbout" class="i-info__section q-pt-lg q-mb-lg">
        <div class="i-info__section__inner row q-col-gutter-md">
          <div class="col-7">
            О продукте
          </div>
          <div class="col-17" v-html="descAbout">
          </div>
        </div>
      </div>

      <div v-if="descSostav" class="i-info__section q-pt-lg q-mb-lg">
        <div class="i-info__section__inner row q-col-gutter-md">
          <div class="col-7">
            Что по составу
          </div>
          <div class="col-17" v-html="descSostav">
          </div>
        </div>
      </div>

      <div v-if="descCook" class="i-info__section q-pt-lg q-mb-lg">
        <div class="i-info__section__inner row q-col-gutter-md">
          <div class="col-7">
            Как есть и с чем готовить
          </div>
          <div class="col-17" v-html="descCook">
          </div>
        </div>
      </div>

      <div v-if="descDelivery" class="i-info__section q-pt-lg q-mb-lg">
        <div class="i-info__section__inner row q-col-gutter-md">
          <div class="col-7">
            Доставка
          </div>
          <div class="col-17" v-html="descDelivery">
          </div>
        </div>
      </div>

      <div v-if="isMounted">

        <div class="c-reviews" id="reviews">

          <div class="i-info__header text-weight-bold q-pb-sm">
            Отзывы
          </div>

          <div class="c-reviews__headline flex no-wrap items-end border-b-1 border-primary-brown-gray-1 q-pb-md">

            <template v-if="reviewsCount > 0">

              <div class="c-reviews__rating row items-center q-col-gutter-x-md q-col-gutter-y-sm">

                <div v-if="propVal.RATING" class="col-24 col-md-auto">
                  <q-rating
                      :value="propVal.RATING"
                      class="c-reviews__rating__stars"
                      color="primary-brown-gray-1"
                      color-half="actions-yellow"
                      color-selected="actions-yellow"
                      icon="star"
                      icon-half="star_half"
                      icon-selected="star"
                      max="5"
                      no-dimming
                      readonly
                      size="22px"
                  />
                </div>

                <div class="c-reviews__rating__stats col-24 col-md-auto q-mt-xs flex leading-none">
                  <div v-if="propVal.RATING" class="text-weight-bold q-mr-sm">
                    {{ propVal.RATING }} /
                  </div>
                  <div class="text-primary-brown-gray-4  ">
                    {{ propVal.RATING_VOTES || reviewsCount }}
                    {{ propVal.RATING_VOTES || reviewsCount | pluralize('ru', ['отзыв', 'отзыва', 'отзывов']) }}
                  </div>
                </div>

              </div>

            </template>

            <template v-else>

              <div>пока нет отызов</div>

            </template>

            <div class="c-reviews__action q-ml-auto">

              <q-btn
                  :to="{name: 'review:product.add', params: {entityId: entity.ID}}"
                  class="q-pa-xs --leading-none --no-wrapper"
                  color="primary"
                  dense
                  flat
                  label="Написать отзыв"
              />

            </div>

          </div>


          <div class="c-reviews__items relative-position">

            <review-entity-product
                v-for="(review, index) of (reviewsResult && reviewsResult.nodes)"
                :key="review.ID"
                :item="review"
                class="q-py-md border-b-1 border-primary-brown-gray-1"
            />

            <ui-progress-inner-loading
                :reserve-height="!reviewsCount ? '100px' : false"
                :value="reviewsState.isLoading"
            />

          </div>

        </div>

      </div>


    </div>

  </div>
</template>

<script>
import CParent from './product-element-detail-base'
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  name: 'product-card-detail',
  extends: CParent,

  apollo: {
    reviews: generateQueryInfo('reviews', require('@tgin/review/pub/gql/query/recordset.gql'), {
      fetchPolicy: 'no-cache'
    }, {
      varPath: 'reviewsVars',
      resPath: 'reviewsResult',
      statePath: 'reviewsState',
    }),
  },

  components: {},
  computed: {
    reviewsCount() {
      return this.reviewsResult && this.reviewsResult.nodes && this.reviewsResult.nodes.length || 0
    },
    reviewsVars() {
      return {
        filter: {
          ELEMENT_ID: {eq: this.entity.ID},
        }
      }
    }
  },
  data() {
    return {
      reviewsResult: null,
      reviewsState: {isLoading: false},
    }
  },
  methods: {
    reviewsRefetch() {
        this.$apollo.queries.reviews.refetch()
    }
  },
  created() {
    this.$bus.on('entity.changed:review', this.reviewsRefetch);
  },
  beforeDestroy() {
    this.$bus.off('entity.changed:review', this.reviewsRefetch);
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
  height: 256px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
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
