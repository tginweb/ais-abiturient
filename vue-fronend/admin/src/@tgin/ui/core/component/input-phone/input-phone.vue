<template>

  <div>

    <q-input
        v-model="valueState"
        v-bind="bind"
        :mask="formatMask"
        :rules="[
            val => !bind.required || !!val || 'Обязательное поле',
            val => !val || $util.validate.checkPhone(valueState, formatState) || 'Неверный формат',
            ...rules
        ]"
        @blur="$emit('blur')"
        placeholder="+7"
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
import {propsWatch} from '@tgin/main/common/lib/util/vue'

export default {
  mixins: [MValuable],
  props: {
    ...quasarInputProps,
    value: {},
    format: {default: null},
  },
  data() {
    return {
      bind: this.$util.vue.propsPass(quasarInputProps, this),
      formatState: this.format ? this.format : '+7 (###) ### - ####'
    }
  },
  computed: {
    formatMask() {
      return this.formatState
    },
    valueStateFormatValid() {
      return this.$util.validate.checkPhone(this.valueState)
    },
  },
  methods: {
    propValuePrepare(v) {
      if (v) {
        const firstChar = v.charAt(0)
        return (firstChar === '7' || firstChar === '8')  ? v.substring(1) : v
      }
      return v
    }
  },
  watch: {
    ...propsWatch(quasarInputProps)
  }
}
</script>
