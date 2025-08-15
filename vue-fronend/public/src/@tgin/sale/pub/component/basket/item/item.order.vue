<template>
  <div class="com">

    <div class="i-content row  q-col-gutter-x-sm q-col-gutter-lg-x-md">

      <div class="col-3 col-md-3 text-center">

        <router-link :to="element.URL" v-if="element">
          <img
              v-if="elementImage"
              :src="$image.resolveUrl(elementImage.SRC, 'r100')"
              style="max-height: 72px;"
          >
        </router-link>

      </div>

      <div class="col-11 col-md-12 col-xl-14">

        <div class="c-name s-font-sm s-font-sm-md -text-weight-bold">

          <router-link :to="element.URL" v-if="element">{{ item.NAME }}</router-link>
          <span v-else>{{ item.NAME }}</span>

        </div>


        <div class="c-catalog flex q-mt-xs" v-if="true">

          <div class="c-catalog-price flex">

            <div class="c-catalog-price__discounted ">
              {{ $util.format.price(itemPrice, true) }}
            </div>

          </div>

          <div v-if="element && element.MEASURE" class="c-catalog__measure text-primary-brown-gray-3  q-ml-md">
            за {{ element.MEASURE.RATIO }} {{ element.MEASURE.NAME }}
          </div>

        </div>

        <div v-if="itemPriceDiscount < -1" class="q-my-xs">
          Скидка составила: <span class="text-actions-red">{{ $util.format.price(itemFinalPriceDiscount) }}</span>
        </div>

        <div class="c-comment q-mt-xs s-font-xs"  v-if="!commentEnable && false">
           <span
               class="text-primary cursor-pointer"
               @click="commentEnable = !commentEnable"
           >
            {{ commentEnable ? 'Удалить комментарий' : 'Пожелания к товару' }}
          </span>
        </div>

        <div v-if="commentEnable" class="col-24 q-pt-md">

          <q-input
              v-model="commentState"
              autogrow
              class=""
              input-class="q-pb-md"
              outlined
              placeholder="Пожелания по заменам, внешнему ввиду и тд…"
              rows="1"
              type="textarea"
              @blur="onCommentBlur"
              maxlength="500"
              clearable
              @clear="commentEnable = false"
              label="Пожелания к товару"
          />

        </div>

      </div>

      <div class="col-8 col-md-8 col-xl-7">

        <div class="c-sale flex no-wrap items-center s-font-md q-gutter-x-sm q-gutter-lg-x-md  justify-end leading-none">

          <div class="c-sale__price text-weight-bold ">
            {{ $util.format.price(item.FINAL_PRICE_COMP, true) }}
          </div>

        </div>

        <CItemQuantity
            :id="item.ID"
            v-model="quantityInput"
            :measureName="measureName"
            :measureRatio="measureRatio"
            class="q-pt-sm"
            v-if="element"
            size="14px"
            style="max-width:120px;"
        />


      </div>

    </div>

  </div>
</template>

<script>

import CItem from './item'

export default {
  extends: CItem

}
</script>

<style lang="scss" scoped>


</style>
