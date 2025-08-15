<template>
  <div class="com">

    <PropsGroup
      v-for="group of groups"
      :key="group.ID"
      :group="group"
      class="q-mb-lg"
    />

  </div>
</template>

<script>

  import PropsGroup from "./group.order";

  export default {
    props: {
      groups: {},
    },
    components: {
      PropsGroup
    },
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>


</style>
