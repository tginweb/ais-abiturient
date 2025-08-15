<template>

  <component v-bind="{...bind, ...bindLink}">

    <div class="leading-zero">
      <img
        :src="itemListImage.SRC"
        v-if="itemListImage"
        style="pointer-events: none;"
      />
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
    compUrl() {
      return this.propVal.BANNER_URL
    },
    itemListImage() {
      return this.entity.LIST_IMAGE || this.entity.DETAIL_IMAGE
    },

    itemDetailImage() {
      return this.entity.DETAIL_IMAGE || this.entity.LIST_IMAGE
    },
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>


</style>
