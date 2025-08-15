<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    title="Синхронизация"
    @hide="onHide"
  >

  </component>

</template>

<script>

import MVroute from '@common/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {

  },
  components: {},
  data() {
    return {

    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Синхронизировать наборы', color: 'primary',  callback: this.onSubmit
        }
      ]
    }
  },
  methods: {

    async onSubmit() {
      try {
        const {data} = await this.$apollo.mutate({
          mutation: require('../gql/mutation/sync.gql'),
        })

        console.log(data)

      } catch (e) {
        console.log(e)
      }
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
