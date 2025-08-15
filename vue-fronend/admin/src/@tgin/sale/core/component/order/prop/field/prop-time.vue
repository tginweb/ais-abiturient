<template>
  <div class="com">

    <div class="q-mb-xs" v-if="label">
      {{ label }}
    </div>

    <q-field
      :rules="rules"
      :value="valueState"
      borderless
      class="q-pt-none custom-field"
      dense
    >
      <template v-slot:control>
        <ui-options
          v-model="valueState"
          :options="optionsComp"
          optionLabel="NAME"
          optionValue="VALUE"
        />
      </template>
    </q-field>
  </div>
</template>

<script>

import CProp from './prop-base'
import dayjs from 'dayjs'

export default {
  extends: CProp,
  computed: {

    optionsComp() {

      const todayDate = this.$util.date.timestampToFormat(Date.now(), 'DD.MM.YYYY')
      const todayTime7 = dayjs().startOf('day').unix() + 7 * 3600
      const todayTime12 = dayjs().startOf('day').unix() + 12 * 3600
      const currentTime = dayjs().unix()

      return this.options.filter((option) => {

        if (this.date.value === todayDate) {
          if (currentTime < todayTime7) {
            return true
          } else if (currentTime < todayTime12) {
            return option.VALUE === '15:00-19:00'
          } else {
            return false
          }
        }

        return true
      })
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
