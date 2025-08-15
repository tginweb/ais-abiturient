<template>
  <div class="com">

    <div class=" row q-col-gutter-x-md items-center q-px-md">

      <div class="col-6 text-center" style="align-self: start;">

        <router-link :to="element.URL" v-if="element && elementImage">
          <img
            :src="$image.resolveUrl(elementImage.SRC, 'r200')"
            class="q-mb-auto"
            style="max-height: 64px;"
          />
        </router-link>

      </div>

      <div class="col-18">

        <div class="c-name text-weight-bold">
          <router-link :to="element.URL" v-if="element">{{ item.NAME }}</router-link>
          <span v-else>{{ item.NAME }}</span>
        </div>

        <div class="flex items-center q-mt-sm q-mb-sm">

          <div class="c-catalog flex">

            <div class="c-catalog-price flex">

              <div class="c-catalog-price__discounted ">
                {{ $util.format.price(itemPrice, true) }}
              </div>

              <div
                v-if="false"
                class="c-catalog-price__base text-primary-brown-gray-3 q-ml-sm text-strike"
              >
              </div>

            </div>

            <div v-if="element && element.MEASURE" class="c-catalog__measure text-primary-brown-gray-3  q-ml-sm">
              {{ element.MEASURE.RATIO }} {{ element.MEASURE.NAME }}
            </div>

          </div>

          <div class="c-price-final text-weight-bold s-font-lg q-ml-auto">

            {{ $util.format.price(item.FINAL_PRICE_COMP, true) }}

          </div>

        </div>

      </div>

    </div>

    <div class="row q-col-gutter-x-md items-center q-px-md">

      <div class="col-6 ">

        <div class="c-actions flex justify-center no-wrap s-font-xl q-gutter-x-sm leading-none">

          <q-btn
            :icon="$icons.close"
            class=""
            color="dark"
            dense
            flat
            size="10px"
            @click="$emit('remove', item.ID)"
          />

          <q-btn
            :icon="inFavorites ? $icons.favoriteFilled : $icons.favorite"
            class=""
            color="dark"
            dense
            flat
            size="14px"
            @click="onFavToggle"
          />

        </div>

      </div>

      <div class="col-18 ">

        <CItemQuantity
          :id="item.ID"
          v-model="quantityInput"
          :measureName="measureName"
          :measureRatio="measureRatio"
          class=""
        />

      </div>

    </div>

    <div class="row q-col-gutter-x-md items-center q-px-md q-mt-sm" v-if="!dropdown">

      <div class="col-6 ">


      </div>

      <div class="col-18 ">

        <div class="c-comment q-mt-xs" v-if="!commentEnable">
          <span
            class="text-primary cursor-pointer"
            @click="commentEnable = !commentEnable"
          >
            {{ commentEnable ? 'Удалить комментарий' : 'Пожелания к товару' }}
          </span>
        </div>

      </div>

    </div>

    <div
      v-if="commentEnable"
      :class="{
        'q-mt-sm': !!dropdown
      }"
    >

      <q-input
        v-model="commentState"
        autogrow
        borderless
        class=" q-px-md"
        input-class="s-font-xs q-pb-md "
        maxlength="500"
        placeholder="Пожелания по заменам, внешнему ввиду и тд…"
        rows="1"
        stack-label
        type="textarea"
        outlined
        label="Пожелания к товару"
        @blur="onCommentBlur"
        @clear="commentEnable = false"
        clearable
        :readonly="!!dropdown"
      />

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
