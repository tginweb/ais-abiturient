<template>

  <div class="com com-filter">

    <input type="text" v-model="internalValue" v-bind="bindControl">

  </div>

</template>

<script>

  export default {
    props: {
      value: {},
      params: {}
    },
    data() {
      return {
        internalValue: this.value,
      }
    },
    computed: {
      bindControl() {
        let res = this.params || {};
        return res;
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
  }

</script>

<style lang="scss" scoped>


</style>
