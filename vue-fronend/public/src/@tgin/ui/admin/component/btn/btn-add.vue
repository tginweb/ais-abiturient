<template>

  <q-btn
      class="com full-width border-primary-brown-gray-5 border-dashed border-w-2 q-py-sm"
      color="grey-3"
      text-color="dark"
      bg-color="dark"
      unelevated
      icon="add_circle_outline"
      :label="label"
      @click="$emit('click')"
      :to="to"
      :size="size"
  />

</template>

<script>
export default {
  props: {
    label: {},
    to: {},
    size: {default: 'md'},
  },
}
</script>

<style lang="scss" scoped>


</style>
