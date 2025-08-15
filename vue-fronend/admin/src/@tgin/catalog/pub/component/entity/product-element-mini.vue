<template>
  <div class="com border-b-1 border-primary-brown-gray-1" >

    <div class="row items-center q-col-gutter-x-sm  no-wrap  ">

      <div class="col-shrink q-mr-xs">

        <q-avatar rounded>

          <component v-bind="bindLink" v-if="itemListImage">
            <img :src="$image.resolveUrl(itemListImage.SRC, 'r100')"/>
          </component>

        </q-avatar>

      </div>

      <div class="col-shrink">

        <router-link :to="compUrl" class="">

          <div>
            {{ itemTitle }}
          </div>

          <div class="c-item__catalog q-mt-sm flex">

            <div v-if="entity.PRICE && entity.PRICE.PRICE" class="i-price leading-none flex q-mr-sm">

              <div class="i-price__discounted leading-none text-weight-bold">
                {{ measurePriceDiscounted | price}}
              </div>

              <div v-if="entity.PRICE.DISCOUNT_PERCENT" class="i-price__base  q-ml-xs q-pl-sm q-mt-auto text-strike">
                {{ measurePriceBase | price}}
              </div>

            </div>

            <div v-if="entity.MEASURE" class="i-measure text-grey-6 leading-none q-mb-sm">
              за {{ measureRatio }} {{ measureName }}
            </div>

          </div>

        </router-link>

      </div>

      <div class="col-auto q-ml-auto" style="max-width:110px;">

        <template v-if="!inBasket">

          <div class="i-sale text-right">
            <q-btn
                :icon="$icons.plus"
                class="q-px-xs q-py-xs"
                color="dark"
                dense
                flat
                size="16px"
                unelevated
                @click="onBasketAdd"
            />
          </div>

        </template>

        <template v-else>

          <sale-basket-item-quantity
              v-model="basketQuantityInput"
              :measureRatio="measureRatio"
              class="i-quantity full-width"
              size="14px"
          />

        </template>

      </div>

    </div>

  </div>
</template>

<script>
import CEntity from './product-element-card'

export default {
  extends: CEntity,
  components: {},
}
</script>

<style lang="scss" scoped>

.com {
  &:last-child {
    border-bottom: 0;
  }
}

.i-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.i-header {
  min-height: 63px;
}

.i-thumb-img {
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

.i-flag {
  position: relative;

  &:after {
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    z-index: 1;
    border-top: 14px solid transparent;
    border-right: 10px solid #FFF;
    border-bottom: 14px solid transparent;
  }
}

@media (max-width: $breakpoint-xs-max) {
  .i-thumb-img {
    height: 158px;
  }

  .i-meta {
    .q-btn {
      font-size: 14px;
    }
  }
}

.com {


}

</style>
