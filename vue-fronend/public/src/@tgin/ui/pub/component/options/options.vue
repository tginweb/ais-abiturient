<template>
  <div class="flex q-gutter-xs">

    <div
        v-for="(option, index) of options"
        :key="index"
        :class="{
        'c-option flex q-px-md q-py-sm leading-none cursor-pointer': true,
        'selected': option[optionValue] === valueState
      }"
        @click="onClickOption(option)"
    >

      <q-icon
          v-if="option[optionImage]"
          :name="option[optionImage]"
      >
        {{ option[optionImage] }}
      </q-icon>

      <span v-if="option[optionLabel]">
        {{ option[optionLabel] }}
      </span>

    </div>

  </div>
</template>

<script>

export default {
  props: {
    options: {},
    value: {},
    label: {},

    'optionLabel': {
      default: 'label'
    },
    'optionValue': {
      default: 'value'
    },
    'optionImage': {
      default: 'image'
    },
  },
  data() {
    return {
      valueState: this.value,
    }
  },
  watch: {
    valueState(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.valueState = val
    }
  },
  methods: {
    onClickOption(option) {
      this.valueState = option[this.optionValue]
    }
  }
};
</script>
<style lang="scss" scoped>

.c-option {
  background-color: #F8F5F2;

  &.selected {
    border: 1px solid #888;
  }
}

</style>
