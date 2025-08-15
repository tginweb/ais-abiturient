<template>

  <div class="">

    <CProfile
        :item="defaultProfile"
        :show-person-type="false"
        v-if="defaultProfile"
    />
    <div v-else>
      не сохрненных адресов
    </div>

  </div>

</template>

<script>
import CProfile from "@tgin/sale/pub/component/order/profile/inc/profile";

export default {
  components: {
    CProfile
  },
  data() {
    return {}
  },
  computed: {
    defaultProfile() {
      if (this.$store.state.sale_pub.user.orderProfiles.length) {
        return this.$store.state.sale_pub.user.orderProfiles.find(profile => true)
      }
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
