<template>

  <div>


  </div>

</template>

<script>

export default {
  async created() {
    if (this.$store.getters['user/authorized']) {
      this.$router.replace('/admin/dashboard')
    } else {
      this.$router.push({name: 'user:auth'})
    }
  },
}
</script>

<style lang="sass" scoped>


</style>
