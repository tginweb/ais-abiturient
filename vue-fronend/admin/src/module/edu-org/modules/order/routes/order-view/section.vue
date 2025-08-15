<template>

  <div class="com s-info-section">

  </div>

</template>

<script>


export default {
  props: {
    orderData: {},
    edit: {},
  },
  components: {},
  data() {
    return {
      canSave: true,
    }
  },
  methods: {},
  computed: {
    readnonly() {
      return !this.edit
    },
    dataEducation() {
      return this.orderData.anket.education
    },
    dataPersonal() {
      return this.orderData.anket.personal
    },
    dataEntrance() {
      return this.orderData.anket.entrance
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
