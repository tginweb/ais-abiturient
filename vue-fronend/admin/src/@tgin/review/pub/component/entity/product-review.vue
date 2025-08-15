<template>
  <div class="query-item">

    <div class="row">

      <ui-avatar
        :src="authorAvatarSrc"
        size="32px"
        class="q-mr-md"
      />

      <div class="c-info col-auto q-mr-2md">

        <div class="c-author">{{ authorName }}</div>
        <div class="c-date text-primary-brown-gray-4">
          {{ item.ACTIVE_FROM }}
        </div>

      </div>

      <div class="c-rating col-auto q-ml-auto">

        <div
          :class="{
           'flex items-center q-pa-xs leading-none': true,
           [ratingClass]: true
          }"
        >
          <q-icon :name="$icons.star" class="q-mr-xs" size="16px"/>
          <span>{{ centity.PROPV.RATING }}</span>
        </div>

      </div>

      <div v-if="colProductEnable && item.ELEMENT" class="c-product q-ml-sm">

        <router-link :to="item.ELEMENT.URL">
          <img
            v-if="productElementImage"
            :src="$image.resolveUrl(productElementImage.SRC, 'r100')"
          />
        </router-link>

      </div>

    </div>

    <div class="c-text q-mt-sm" v-html="item.DETAIL_TEXT_FORMATTED">
    </div>

  </div>
</template>

<script>
import CParent from '@tgin/ui/core/component/entity/entity-element'

export default {
  extends: CParent,
  components: {},
  props: {
    colImageClass: {default: 'col-1 q-mr-2md'},
    colProductEnable: {default: false},
    ratingClass: {default: 'bg-primary-brown-1 text-dark'},
  },
  data() {
    return {}
  },

  computed: {

    centity() {
      return this.$store.getters['iblock/prepareElement'](this.item)
    },

    productElementImage() {
      return this.item.ELEMENT && this.item.ELEMENT.LIST_IMAGE
    },

    authorAvatarSrc() {
      if (this.item.USER && this.item.USER.AVATAR && this.item.USER.AVATAR.IMAGE) {
        return this.item.USER.AVATAR.IMAGE.SRC
      } else {
        return '/statics/profile.png'
      }
    },

    authorName() {
      if (this.centity.PROPV.AUTHOR_NAME) {
        return this.centity.PROPV.AUTHOR_NAME
      } else if (this.centity.USER) {
        return this.centity.USER.NAME
      } else {
        return 'Клиент'
      }
    }
  }

}
</script>

<style lang="scss" scoped>

.c-product {
  max-width: 40px;
}

@media (max-width: $breakpoint-sm-max) {
  .c-product {
    max-width: 20px;
  }
}

</style>
