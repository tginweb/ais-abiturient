<template>

  <div>


  </div>

</template>

<script>

export default {

  async created() {
    console.log('FRONT')
    console.log(this.$store.getters['user/authorized'])

    if (this.$store.getters['user/authorized']) {
      this.$router.replace('/cab/order/view')
    } else {
      this.$router.push({name: '/pub/auth'})
    }
  },
}
</script>

<style lang="sass" scoped>


</style>
