<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actionsClose="true"
    :loading="fetching"
    :path="pagePathFull"
    dialogWidth="600px"
    title="Помощь"
    @hide="onHide"
  >

  </component>

</template>

<script>

import MRoute from "~module/user/component/profile/route.mixin"
import MVRoute from '@common/router/mixin/vroute'

export default {
  mixins: [MRoute, MVRoute],
  components: {

  },
  data() {
    return {
      page: {
        title: 'Адреса доставки',
      },
      pageIs: 'user-profile-page'
    }
  },
  computed: {}

}

</script>

<style lang="scss" scoped>


</style>
