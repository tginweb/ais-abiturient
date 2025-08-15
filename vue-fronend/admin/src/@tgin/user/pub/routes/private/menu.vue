<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions-close="true"
    title="Меню профиля"
    @hide="onHide"
    :menu="$store.getters['user/menuPersonal']"
  >
  </component>

</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

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
