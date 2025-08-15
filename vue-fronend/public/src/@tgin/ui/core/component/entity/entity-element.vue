<template>

  <div class="query-item">

  </div>

</template>

<script>

import Parent from './entity-base'

export default {
  extends: Parent,
  props: {},
  data() {
    return {}
  },
  methods: {},

  computed: {
    prop() {
      return this.entity.PROPS && this.entity.PROPS.reduce((map, obj) => (map[obj.CODE] = obj, map), {});
    },

    propVal() {
      return this.entity.PROPS && this.entity.PROPS.reduce((map, obj) => (map[obj.CODE] = obj.VAL, map), {});
    },

    itemListImage() {
      return this.entity.LIST_IMAGE || this.entity.DETAIL_IMAGE
    },

    itemDetailImage() {
      return this.entity.DETAIL_IMAGE || this.entity.LIST_IMAGE
    },

    itemTitle() {
      return this.entity.NAME
    },

    itemSubtitle() {
      return this.entity.SUBTITLE
    },

    itemDate() {
      return this.entity.ACTIVE_FROM
    },

  }
}
</script>

<style lang="scss" scoped>


</style>
