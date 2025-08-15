<template>
  <div class="com">

    <q-input
      v-model="valueState"
      :label="label"
      @blur="onBlur"
    />

  </div>
</template>

<script>

import CProp from './prop-base'

export default {
  extends: CProp,
  methods: {
    onValueStateChange(val) {
      if (this.internalChange)
        this.$emit('input', val)
    },

    onValueBlurStateChange(val) {
      // if (this.internalChange)
      this.$emit('change', val)
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
