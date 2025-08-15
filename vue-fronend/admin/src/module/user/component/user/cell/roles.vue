<template>

  <ul class="q-pl-md q-my-none">
    <li v-for="role of row.roles">
      {{ role }}
    </li>
  </ul>

</template>

<script>
export default {
  props: {
    row: {},
  },
}
</script>

<style lang="scss" scoped>


</style>
