<template>
  <div class="com">
    <div class="q-mb-xs" v-if="label">
      {{ label }}
    </div>
    <q-field
        :value="valueState"
        :rules="rules"
        borderless
        reactive-rules
        class="q-pt-none custom-field"
    >
      <template v-slot:control>
        <ui-options
            :no-wrap="noWrap"
            :options="options"
            v-model="valueState"
            :fullWidth="fullWidth"
            optionLabel="NAME"
            optionValue="VALUE"
            optionCaption="DESCRIPTION"
            class="text-center"
        />
      </template>
    </q-field>
  </div>

</template>

<script>

import CProp from './prop-base'

export default {
  extends: CProp,
  props: {
    noWrap: {},
    fullWidth: {},
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
