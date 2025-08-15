<template>
  <div class="com">

    <q-select
        :label="label"
        v-model="valueState"
        :options="options"
        map-options
        emit-value
        optionLabel="NAME"
        optionValue="VALUE"
        :rules="rulesExt"
        outlined
    >
    </q-select>

  </div>
</template>

<script>

import CProp from './prop-base'

export default {
  extends: CProp,

  computed: {
    rulesExt() {

      const rules = this.rules.slice()

      rules.unshift(val => !!this.optionsByValue[val] || 'Не выбрана дата')

      return rules
    },

    optionsByValue() {
      return this.options.reduce((map, item) => {
        map[item.VALUE] = item.VALUE
        return map
      }, {}) || {}
    },

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
