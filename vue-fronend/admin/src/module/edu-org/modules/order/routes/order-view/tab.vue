<template>


</template>

<script>

export default {
  props: {
    order: {},
  },
  components: {},
  data() {
    return {
      changed: null,
    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    onReset() {
      this.unsetChanged()
    },
    isChanged() {
      return this.changed
    },
    unsetChanged() {
      this.changed = false
    },
    reload() {
      this.$emit('refetch')
    },
  },
  watch: {
    changed(v) {
      this.$emit('update:changed', v)
    }
  }
}

</script>

<style lang="scss" scoped>

.selected-test {
  font-weight: bold;
}

td.error {
  background-color: #f3afaf;
}

</style>
