<template>
  <div class="com">


    <q-select
      v-model="valueState"
      :label="label"
      :options="options"
      :outlined="outlined"
      emit-value
      map-options
      option-label="NAME"
      option-value="VALUE"
    >
      <template
          v-for="(_, name) in $slots"
          :slot="name"
      >
        <slot :name="name"/>
      </template>
    </q-select>

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
