<template>

  <q-inner-loading :showing="valueState">
    <div class="text-center">
      <q-spinner
          color="primary"
          :size="size"
          :thickness="thickness"
      />
      <div v-if="label">
        {{ label }}
      </div>
    </div>
  </q-inner-loading>

</template>

<script>

export default {
  props: {
    size: {
      default: '3em'
    },
    thickness: {
      default: 10
    },
    value: {},
    label: {}
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
