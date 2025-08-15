<template>
</template>

<script>
export default {
  props: {
    row: {},
  },
  methods: {
    ensureArray(v) {
      if (v) {
        return Array.isArray(v) ? v : [v]
      } else {
        []
      }
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
