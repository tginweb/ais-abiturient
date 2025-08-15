<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      title="ФИС пакет проверки ЭГЭ"
      @hide="onHide"
  >

    <q-input
        type="textarea"
        v-model="packet"
        outlined
        label="Пакет"
    />

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    ids: {}
  },
  components: {

  },
  data() {
    return {
      packet: ''
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Скачать файл',
          callback: this.onDownload
        }
      ]
    },
  },
  async created() {

    await this.fetch()
  },
  methods: {

    async fetch() {

      const {data: {res}} = await this.$apollo.query({
        query: require('../gql/order/query/fisEgePacket.gql'),
        fetchPolicy: 'no-cache',
        variables: {
          filter: {
            nid: {in: this.ids}
          }
        }
      })

      this.packet = res.join("\n")
    },

    onDownload() {
      this.$util.base.downloadCustomContent('packet.txt', this.packet)
    }

  },
  watch: {}

}

</script>

<style lang="scss" scoped>


</style>
