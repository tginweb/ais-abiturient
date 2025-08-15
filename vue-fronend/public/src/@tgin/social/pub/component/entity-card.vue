<template>

  <component v-bind="{...bind, ...bindLink}">

    <div class="leading-zero">
      <img
        :src="$image.resolveUrl(itemListImage.SRC, 'm2.75')"
        v-if="itemListImage"
      />
    </div>

    <h3 class="q-mb-none q-mt-sm">
      {{ entity.NAME }}
    </h3>

    <div class="text-primary-brown-gray-4 s-font-3xs q-mt-xs">
      {{ entity.ACTIVE_FROM }}
    </div>

  </component>

</template>

<script>

import CParent from '@tgin/ui/core/component/entity/entity-element'

export default {
  extends: CParent,
  props: {
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


</style>
