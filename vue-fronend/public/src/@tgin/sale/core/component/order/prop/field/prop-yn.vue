<template>
  <div class="com">

    <div v-if="readonly" class="q-mt-sm">

      <q-icon :name="$icons.check" size="13px" class="q-mr-sm"/> {{label}}

    </div>

    <q-toggle
      v-else
      v-model="valueState"
      :label="label"
      @blur="onBlur"
      true-value="Y"
      false-value="N"
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
  }
}

</script>

<style lang="scss" scoped>


</style>
