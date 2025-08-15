<template>

  <div>
    <div
        v-if="reserveHeight && valueState"
        :style="{
          height: reserveHeight
        }"
    >
    </div>
    <q-inner-loading :showing="valueState">
      <q-spinner
          color="primary"
          :size="size"
          :thickness="thickness"
      />
    </q-inner-loading>
  </div>

</template>

<script>

  export default {
    props: {
      reserveHeight: {
        default: false
      },
      size: {
        default: '3em'
      },
      thickness: {
        default: 10
      },
      value: {}
    },
    data() {
      return {
        valueState: this.value
      }
    },
    watch: {
      value(val) {
        this.valueState = val
      },
      valueState(val) {
        this.$emit('input', val)
      },
    }
  }

</script>

<style lang="scss" scoped>


</style>
