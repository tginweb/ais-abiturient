<template>
  <div class="com">

    <template
      v-for="prop of props"
    >
      <component
        :key="prop.ID"
        :value="prop.VALUE"
        :propId="prop.ID"
        @input="onInput(prop, $event)"
        @change="onChange(prop, $event)"
        @changeMultuple="onChange(prop, $event)"
        class="q-mb-sm"
        v-bind="bindPropInput(prop)"
        v-if="propIf(prop)"
      />
    </template>

  </div>
</template>

<script>

  export default {
    props: {
      props: {},
    },
    inject: [
      'bindPropInput',
      'onPropInput',
      'onPropChange',
      'onPropChangeMultiple',
      'propIf',
      'propByRole',
      'propsUpdateByRole'
    ],
    components: {},
    data() {
      return {
        valueState: this.value,
      }
    },
    methods: {
      onInput(prop, value) {
        this.onPropInput(prop.ID, value)
      },
      onChange(prop, value) {
        this.onPropChange(prop.ID, value)
      },
      onChangeMultiple(props) {
        this.onPropChangeMultiple(props)
      },
    }
  }
</script>

<style lang="scss" scoped>


</style>
