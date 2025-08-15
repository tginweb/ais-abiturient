<template>
  <div class="query-item leading-zero" style="font-size:0;">

    <div class="c-card flex q-pt-sm q-pb-lg q-pa-sm q-pa-lg-md">

      <div class="c-image flex">
        {{item}}

        <img
          :src="item.DETAIL_IMAGE.SRC"
          v-if="item.DETAIL_IMAGE"
        />
      </div>

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
    authorAvatarSrc() {
      if (this.item.USER && this.item.USER.AVATAR) {
        return this.item.USER.AVATAR.IMAGE.SRC
      } else {
        return '/statics/profile.png'
      }
    },

    authorName() {
      if (this.item.PROPV.AUTHOR_NAME) {
        return this.item.PROPV.AUTHOR_NAME
      } else if (this.item.USER) {
        return this.item.USER.NAME
      } else {
        return 'Клиент'
      }
    }
  }

}
</script>

<style lang="scss" scoped>

.query-item {
  outline: none;
}

.c-card {
  background-color: #F44E21;
  height:610px;
}

.c-image {
  margin: auto;
  height: 94%;

  img {
    max-height: 100%;
    width: auto;
    display: block;
    margin: auto;
  }
}

@media (max-width: $breakpoint-md-max) {

  .c-card {
    height:510px;
  }
}
@media (max-width: $breakpoint-sm-max) {

  .c-card {
    height:auto;
  }
}

</style>
