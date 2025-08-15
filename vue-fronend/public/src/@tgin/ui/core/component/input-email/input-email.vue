<template>

  <div>

    <q-input
        v-model="valueState"
        v-bind="bind"
        :rules="[
            val => !bind.required || !!val || 'Обязательное поле',
            val => !val || $util.validate.checkEmail(valueState) || 'Неверный формат',
            ...rules
        ]"
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
    }
  },
  computed: {
    formatMask() {
      return this.formatState
    },
    valueStateFormatValid() {
      return this.$util.validate.checkEmail(this.valueState)
    },
  },
  watch: {
    ...propsWatch(quasarInputProps)
  }
}
</script>
