<template>
  <div class="com">


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
      value: {},
      label: {},
      hint: {},
      type: {},
      options: {},
      loading: {default: false},
      readonly: {default: false},
      outlined: {default: false},
      lazyRules: {default: false},
      valueInternal: {}
    },
    components: {},
    data() {
      return {
        valueState: this.value,
        valueProxy: this.value,
        valueBlurState: this.value,
        internalChange: true
      }
    },
    watch: {
      valueState(val) {
       // console.log('valueState')
        this.internalChange = true
        this.onValueStateChange(val);
      },
      value(val) {
        this.internalChange = false
        this.valueState = val
        this.valueProxy = val
       // this.valueBlurState = val
      },
      valueBlurState(val) {
        this.onValueBlurStateChange(val);
      },
      valueProxy(val) {
        this.$emit('update:valueInternal', val)
      }
    },

    methods: {
      onValueBlurStateChange(val) {

      },
      onValueStateChange(val) {

      },
      onBlur(e) {
        if (this.valueBlurState !== this.valueState) {
          this.valueBlurState = this.valueState
        }
      }
    },

    computed: {
      valueFilled() {
        return !!this.valueState
      },

      rules() {

        const rules = [];

        if (this.prop.PROP.IS_REQUIRED) {
          rules.push(val => this.valueFilled || 'Обязательное поле')
        }

        return rules
      }
    }

  }
</script>

<style lang="scss" scoped>


</style>
