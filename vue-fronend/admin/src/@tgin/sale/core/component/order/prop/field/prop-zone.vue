<template>
  <div class="com">
    <q-select
      v-model="valueState"
      :label="label"
      :options="options"
      emit-value
      map-options
      option-label="NAME"
      option-value="VALUE"
      readonly
      hide-dropdown-icon
      :outlined="outlined"
    >
    </q-select>
  </div>
</template>

<script>

import CProp from './prop-base'

export default {
  extends: CProp,
  components: {

  },
  data() {
    return {
      mapOpened: false
    }
  },
  methods: {
    onValueStateChange(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
  }
}

</script>

<style lang="scss" scoped>


</style>
