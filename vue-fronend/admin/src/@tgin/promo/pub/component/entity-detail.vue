<template>

  <div>
    <div class="c-image leading-zero q-mb-lg">
      <img
        class="c-image__img"
        :src="$image.resolveUrl(item.DETAIL_IMAGE.SRC, 'm2.75')"
        v-if="item.DETAIL_IMAGE"
      />
    </div>

    <div class="c-body">

      <div class="ui-content-style ui-content-text" v-html="item.DETAIL_TEXT"></div>

    </div>
  </div>

</template>

<script>

export default {
  props: {
    item: {}
  },
  components: {},
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>

.c-image {
  .c-image__img {
    width: 100%;
  }
}

</style>
