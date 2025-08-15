<template>
  <div class="com">

    <q-btn-toggle
      v-model="valueState"
      :options="locationOptions"
      label="Выберите местоположение"
      toggle-color="primary"
    />

  </div>
</template>

<script>

import CProp from './prop-base'

export default {
  extends: CProp,

  methods: {
    onValueStateChange(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
  },
  computed: {
    locationOptions() {
      return this.$store.state.sale.app.defaultLocations && this.$store.state.sale.app.defaultLocations.map(item => ({
        value: item.CODE,
        label: item.NAME,
      })) || []
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
