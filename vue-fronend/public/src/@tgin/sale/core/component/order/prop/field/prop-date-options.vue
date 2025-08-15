<template>
  <div class="com">
    <div class="q-mb-xs">
      {{ label }}
    </div>
    <q-field
      :value="valueState"
      :rules="rulesExt"
      borderless
      reactive-rules
      class="q-pt-none custom-field"
    >
      <template v-slot:control>
        <ui-options
          v-model="valueState"
          :options="options"
          optionLabel="NAME"
          optionValue="VALUE"
          v-if="false"
        />


        <q-select
            v-model="valueState"
            :options="options"
            optionLabel="NAME"
            optionValue="VALUE"
        >


        </q-select>
      </template>
    </q-field>
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

    dateOptions() {

      const res = [];

      const today = new Date()

      for (let i = 0; i < 12; i++) {
        let date = new Date(today)
        date.setDate(date.getDate() + i)

        res.push({
          'label': date.toString(),
          'value': date.toString()
        })
      }

      return res
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
