<template>

  <div class="com com-filter">

    <div class="label">
      {{label}}:
    </div>

    <slot v-bind="{internalValue}">
      <component v-bind="controlBind" v-model="internalValue"></component>
    </slot>

  </div>

</template>

<script>

  export default {
    components: {

    },
    props: {
      label: {},
      controlIs: {},
      control: {},
      value: {}
    },
    data() {
      return {
        internalValue: this.value,
      }
    },
    watch: {
      internalValue(val) {
        this.$emit('input', val)
      },

      value(val) {
        this.internalValue = val
      }
    },
    computed: {

      controlBind() {

        let res = {
          is: this.controlIs,
          params: this.control
        }

        return res;
      }
    }
  }

</script>

<style lang="scss" scoped>


</style>
