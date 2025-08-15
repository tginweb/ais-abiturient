<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      @hide="onHide"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      dialog-width="850px"
      :title="entityState && entityState.NAME"
  >

    <template v-slot:headerz v-if="entity">

      <div class="i-favs q-ml-auto">

        <q-btn
            :icon="inFavorites ? $icons.favoriteFilled : $icons.favorite"
            color="primary-brown-gray-2"
            dense
            flat
            @click="onFavToggle"
        />

      </div>

    </template>

    <template v-slot:bottom v-if="entity">


      <div class="i-sale q-mb-sm" v-if="isMounted">

        <template v-if="!inBasket">

          <div class="flex">

            <q-btn
                class="q-px-2lg s-font-md full-width"
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

    </template>

    <template v-slot:default v-if="entity">

      <div class="row q-col-gutter-md-lg q-pb-lg">

        <div class="col-24 col-md-12" id="dd">

          <div
              style="position: sticky;top:0;"
          >
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
                      <span class="q-pr-xs">{{ flag.NAME }}</span>
                    </div>
                  </div>

                </div>

              </div>

              <div class="i-thumb text-center">
                <img
                    v-if="itemListImage"
                    :src="$image.resolveUrl(itemListImage.SRC, 'r400')"
                    class="i-thumb-img"
                    style="max-height: 70vh; width: auto;"
                />
              </div>

            </div>
          </div>

        </div>

        <div class="col-24 col-md-12 flex column">

          <div
              v-if="propVal.VES_UPAKOVKI_1"
              class="s-font-2xl"
              style="font-size: 15px; color: #777;"
          >
            {{ propVal.VES_UPAKOVKI_1 }}
          </div>

          <div
              v-if="propVal.STRANA_PROISKHOZHDENIYA"
              class="i-country q-mt-xs text-primary-brown-gray-4 s-font-xs s-font-xs-md "
          >
            {{ propVal.STRANA_PROISKHOZHDENIYA }}
          </div>

          <div
              v-if="descTeaser"
              class="i-teaser q-mt-md " v-html="descTeaser"
          />

          <div
              class="flex q-gutter-x-md q-mt-md"
              v-if="discountPercent || propVal.RATING"
          >

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

        </div>

      </div>

    </template>

  </component>
</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  props: {
    onSuccess: {}
  },
  data() {
    return {}
  },
  computed: {
    actions() {
      const result = []

      if (this.$q.screen.lt.md && false) {
        result.push({
          label: 'Добавить в корзину',
          color: 'primary',
        })
      }

      result.push({
        label: 'Подробнее',
        color: 'primary',
        callback: this.onNavDetail,
        outline: true
      })

      return result
    },

    pageTitle() {
      return ' '
    },
  },

  methods: {


    onNavDetail() {
      this.$router.push(this.entity.URL)
      this.visible = false
    },

    async fetch() {
      try {

        let product = await this.$store.dispatch('catalog_pub/productElementQuery', {
          filter: {
            ID: {eq: this.entityIdState}
          },
          options: {
            state: this.requestState,
          }
        })

        this.assignEntity(product, this.requestState)

      } catch (e) {
        console.log(e)
      }

    },
  },
  async created() {
    await this.fetch();
  }
}
</script>
<style lang="scss" scoped>

</style>
