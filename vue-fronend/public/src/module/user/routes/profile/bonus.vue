<template>

  <CPage :path="pagePathFull" :title="page.title">

    Бонусы

  </CPage>

</template>

<script>
import MRoute from "~module/user/component/profile/route.mixin"
import CPage from "../../component/profile/page";

export default {
  name: 'page.profile',
  mixins: [MRoute],
  components: {
    CPage
  },
  data() {
    return {
      page: {
        title: 'Бонусы'
      },
    }
  },
  computed: {}
}
</script>
<style lang="scss" scoped>


</style>
