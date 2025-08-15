<template>

  <div>

    <q-input
        v-model="valueState"
        v-bind="bind"
        :rules="rulesExt"
        :mask="formatState"
        unmasked-value
        @blur="$emit('blur')"
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

import quasarInputProps from '@tgin/quasar/lib/props/input'
import MValuable from '@tgin/main/common/mixin/valuable'
import {propsWatch, propsPass} from '@tgin/main/common/lib/util/vue'
import {checkSnils} from '@tgin/main/common/lib/util/validate'

export default {
  mixins: [MValuable],
  props: {
    ...quasarInputProps,
    value: {},
    format: {default: null},
  },
  data() {
    return {
      bind: propsPass(quasarInputProps, this),
      formatState: this.format ? this.format : '###-###-### ##'
    }
  },
  computed: {
    formatMask() {
      return this.formatState
    },
    valueStateFormatValid1() {
      return checkSnils(this.valueState)
    },
    rulesExt() {
      return [
        val => !this.bind.required || !!val || 'Обязательное поле',
        val => !val || checkSnils(this.valueState) || 'Неверный формат',
        ...this.rules
      ]
    }
  },
  watch: {
    ...propsWatch(quasarInputProps)
  }
}
</script>
