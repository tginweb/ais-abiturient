<template>
  <div class="com">

    <ui-radios
      :items="options"
      v-model="valueState"
      optionLabel="NAME"
      optionValue="VALUE"
      optionCaption="DESCRIPTION"
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
