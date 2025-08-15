<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    title="Выход"
    @hide="onHide"
  >
    <div class="text-center">Уверены что хотите выйти из своего аккаунта?</div>
  </component>

</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  props: {
    pr: {}
  },
  components: {},
  data() {
    return {
      pageIs: 'user-profile-page'
    }
  },
  computed: {
    actions() {

      const result = [];

      result.push({
        label: 'Выйти',
        color: 'primary',
        callback: () => {
          this.$store.dispatch('user/logout')
        }
      })

      return result
    },

  }

}

</script>

<style lang="scss" scoped>


</style>
