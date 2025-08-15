<template>

  <div>
    <div class="c-image leading-zero q-mb-lg">
      <img
        class="c-image__img"
        :src="$image.resolveUrl(item.VIEW_PICTURE.SRC, 'm2.75')"
        v-if="item.VIEW_PICTURE"
      />
    </div>

    <div class="c-header q-mb-2lg">
      <h1 class="text-h2 q-mt-none q-mb-sm leading-e4">
        {{ item.NAME }}
      </h1>

      <div class="q-mt-xs">
        {{ item.ACTIVE_FROM }}
      </div>
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
