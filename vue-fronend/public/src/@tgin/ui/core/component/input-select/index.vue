<template>

  <div>

    <q-select
        ref="input"
        v-model="valueState"
        v-bind="bind"
        :options="optionsState"
        use-input
        @filter="filterFn"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
        :rules="rulesExt"
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

import quasarSelectProps from '@tgin/quasar/lib/props/select'
import MValuable from '@tgin/main/common/mixin/valuable'
import {propsWatch} from '@tgin/main/common/lib/util/vue'

export default {
  mixins: [MValuable],
  props: {
    ...quasarSelectProps,
    value: {},

  },
  data() {
    return {
      bind: this.$util.vue.propsPass(quasarSelectProps, this),
      optionsState: this.options
    }
  },

  watch: {
    ...propsWatch(quasarSelectProps),
    options(v) {
      this.optionsState = v
    }
  },
  computed: {
    rulesExt() {
      const rules = []
      if (this.required) {
        rules.push(val => !!val || 'Обязательное поле')
      }
      return [...rules, ...this.rules]
    },
  },
  methods: {
    getOptionField(option, field) {
      if (typeof field === 'function') {
        return field(option)
      }
      return option[field]
    },
    onInputValue(val) {

    },

    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.optionsState = this.options
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.optionsState = this.options.filter(option => {
          const optionLabel = this.getOptionField(option, this.optionLabel) || ''
          return optionLabel.toLowerCase().indexOf(needle) > -1
        })
      })
    }

  }
}
</script>
