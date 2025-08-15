<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actionsClose="true"
    title="Меню профиля"
    @hide="onHide"
    :menu="$store.getters['user/userMenu']"
  >
  </component>

</template>

<script>

import MVRoute from '@common/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  components: {},
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {
    onClickItem(item) {
      if (this.$route.fullPath === item.URL) {
        this.visible = false
      }
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
