<template>

  <div
      class="text-grey-9 s-font-sm"
      style="direction: rtl; max-width: 70px;overflow: hidden;text-overflow: ellipsis;"
  >
   {{row.parent}}
  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },

  methods: {
    doFilter(data) {
      this.$bus.emit('data.filters.set', data)
    }
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>


</style>
