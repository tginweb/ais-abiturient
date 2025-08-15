<template>

  <div>

    <div v-if="row.epgu">
      UID: {{row.epgu.uid}}
    </div>

  </div>

</template>

<script>


export default {
  components: {
  },
  props: {
   row: {}
  }
}
</script>

<style lang="scss" scoped>


</style>
