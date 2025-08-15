<template>

  <div class="s-font-5xs" style="width:150px;">

    <div v-if="row.cancelReasonMessage" >
      {{ row.cancelReasonMessage }}
    </div>
    <div v-else class="text-red">
      {{ row.order.state.message }}
    </div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>


</style>
