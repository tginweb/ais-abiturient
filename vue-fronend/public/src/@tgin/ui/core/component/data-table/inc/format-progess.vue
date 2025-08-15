<template>

  <div>

    <q-linear-progress
        size="25px"
        :value="valueProgress"
        color="primary"
    >
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="valuePercent + '%'" />
      </div>
    </q-linear-progress>

  </div>

</template>

<script>


export default {
  components: {

  },
  props: {
    row: {},
    value: {default: 0}
  },
  data() {
    return {}
  },
  computed: {
    valueProgress() {
      return this.value
    },
    valuePercent() {
      return parseInt(this.value * 100)
    },
  }
}
</script>

<style lang="scss" scoped>


</style>
