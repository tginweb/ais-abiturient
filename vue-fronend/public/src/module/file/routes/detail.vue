<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :loaded="fetched"
      :title="'Файл ' + entityId"
      dialogWidth="900px"
      @hide="onHide"
  >

    <template v-slot:default>

      ыыы

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {}
  },
  components: {},
  data() {
    return {
      tab: 'common',
    }
  },
  computed: {

  },
  created() {
    this.fetch()
  },
  methods: {

    async onSave() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          await this.mutationMethod(async () => {

            try {

              let {data: {res: {result}}} = await this.$apollo.mutate({
                //mutation: require('../gql/mutation/save.gql'),
                variables: {
                  model: this.entity,
                }
              })

              console.log(result)

              this.$bus.emit('processMessages', result.messages);

              if (this.onResolve)
                this.onResolve()

            } catch (e) {

              console.log(e)
            }

          })

        }

      }).catch((e) => {

      })

    },

    async fetch() {
      await this.fetchingMethod(async () => {
        if (this.entityId)
          this.entity = this.entityData || await this.$store.dispatch('file/entityQuerySingle', {id: parseInt(this.entityId)})
      })
    },

  },

}

</script>

<style lang="scss" scoped>


</style>
