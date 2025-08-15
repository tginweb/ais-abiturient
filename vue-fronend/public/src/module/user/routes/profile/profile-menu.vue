<template>

  <ui-dialog
    v-model="visible"
    title="Профиль"
    :actionsClose="true"
    :sheetHeaderEnable="false"
    :menu="$store.getters['user/userMenu']"
  >
  </ui-dialog>

</template>

<script>

import CDialog from '@common/dialog/component/dialog'

export default {
  extends: CDialog,
  props: {
    model: {}
  },
  components: {},
  data() {
    return {
      dialogModule: 'user',
      dialogName: 'profile_menu',
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
