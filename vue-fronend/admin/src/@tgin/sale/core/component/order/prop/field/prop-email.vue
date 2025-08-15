<template>
  <div class="com">

    <ui-input-email
        v-model="valueData"
        :label="label"
        :required="prop.PROP.IS_REQUIRED"
        :empty-return="true"
        :empty-return-value="''"
        lazy-rules
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
    </ui-input-email>
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
  computed: {
    valueData: {
      get: function () {
        return this.valueProxy
      },
      set: function (val) {
        this.valueProxy = val
        if (!val) {
          this.valueState = null
        } else if (this.$util.validate.checkEmail(val)) {
          this.valueState = val
        }
      }
    },
  }
}

</script>

<style lang="scss" scoped>


</style>
