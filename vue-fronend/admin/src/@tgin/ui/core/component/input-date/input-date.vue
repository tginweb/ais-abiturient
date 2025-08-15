<template>
  <div>


    <q-input
        v-model="valueState"
        v-bind="bind"
        :mask="formatMask"
        :fill-mask="fillMask"
        :rules="[
            val => !bind.required || !!val || 'Обязательное поле',
            val => !val || valueStateFormatValid || 'Неверный формат',
        ]"
        @blur="$emit('blur')"
    >
      <template v-slot:append v-if="!timeOnly">
        <q-icon name="event" class="cursor-pointer" v-if="!readonly">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="valueState" :mask="formatState">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat/>
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
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
    required: {default: false},
    time: {default: false},
    timeOnly: {default: false},
    fillMask: {default: false},
  },
  data() {
    return {
      bind: this.$util.vue.propsPass(quasarInputProps, this),
      formatState: this.format ? this.format : this.timeOnly ? 'HH:mm' : (!this.time ? 'DD.MM.YYYY' : 'DD.MM.YYYY HH:mm')
    }
  },
  computed: {
    formatMask() {
      return this.formatState.replaceAll(/\w/g, '#')
    },
    valueStateFormatValid() {
      return !this.valueState || this.timeOnly ? this.$util.validate.checkTime(this.valueState, this.formatState) : this.$util.validate.checkDate(this.valueState, this.formatState)
    }
  },
  watch: {
    ...propsWatch(quasarInputProps)
  }
}
</script>
