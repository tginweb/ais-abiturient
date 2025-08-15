<template>
  <div class="com">


    <ui-input-phone
      v-model="valueData"
      :label="label"
      :required="prop.PROP.IS_REQUIRED"
      :empty-return="true"
      :empty-return-value="''"
      :lazy-rules="true"
      unmasked-value
      @blur="onBlur"
      :readonly="readonly"
      :outlined="!readonly && outlined"
    >
      <template
          v-for="(_, name) in $slots"
          :slot="name"
      >
        <slot :name="name"/>
      </template>
    </ui-input-phone>
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
  },
  watch: {

  },
  computed: {
    valueData: {
      get: function () {
        return this.valueProxy
      },
      set: function (val) {
        const value = val ? '7' + val : val
        this.valueProxy = value
        this.valueState = value
      }
    },
  }
}

</script>

<style lang="scss" scoped>


</style>
