<template>

  <div>

    <div
        v-if="row.status"
        :style="{
          color: row.status.color
       }"
        class="s-badge"
    >
      {{ row.statusTitle }}
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
