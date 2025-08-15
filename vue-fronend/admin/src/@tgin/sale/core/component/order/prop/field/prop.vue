<template>

  <div class="prop">

    <component
        :class="{
          'cursor-pointer': bind.readonly && readonlyClick
        }"
        v-if="propIf(prop)"
        :key="prop.ID"
        v-bind="bind"
        :loading="loading"
        :prop="prop"
        :value="prop.VALUE"
        @change="onChange(prop, $event)"
        @changeMultuple="onChange(prop, $event)"
        @input="onInput(prop, $event)"
        :valueInternal.sync="valueInternalState"
        @click.native="onClick"
    >
      <template
          v-for="(_, name) in $slots"
          :slot="name"
      >
        <slot :name="name"/>
      </template>
    </component>

  </div>

</template>

<script>

export default {
  inject: [
    'bindPropInput',
    'onPropInput',
    'onPropChange',
    'onPropChangeMultiple',
    'propIf',
    'propByRole',
    'propsUpdateByRole',
    'propsUpdate',
    'date',
  ],
  props: {
    prop: {},
    props: {default: () => ({})},
    loading: {default: false},
    readonly: {default: false},
    label: {},
    lazyRules: {},
    hint: {},
    valueInternal: {},
    readonlyClick: {}
  },
  data() {
    return {
      valueInternalState: this.valueInternal
    }
  },
  methods: {
    onInput(prop, value) {
      this.onPropInput(prop.ID, value)
      this.$emit('input', value)
    },
    onChange(prop, value) {
      this.onPropChange(prop.ID, value)
      this.$emit('change', value)
    },
    onChangeMultiple(props) {
      this.onPropChangeMultiple(props)
    },
    onClick() {
      if (this.bind.readonly && this.readonlyClick) {
        this.readonlyClick()
      }
    }
  },
  computed: {
    bind() {
      return {...this.bindPropInput(this.prop, this), ...this.props}
    },
  },
  watch: {
    valueInternalState(val) {
      this.$emit('update:valueInternal', val)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
