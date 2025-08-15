<template>
  <div class="com">


    <q-input
      v-model="valueState"
      :label="label"
      @blur="onBlur"
      :readonly="readonly"
      :rules="rules"
      no-error-icon
      maxlength="150"
      :outlined="!readonly && outlined"
      :hint="hint"
      :lazy-rules="lazyRules"
    >
      <template
          v-for="(_, name) in $slots"
          :slot="name"
      >
        <slot :name="name"/>
      </template>
    </q-input>

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
