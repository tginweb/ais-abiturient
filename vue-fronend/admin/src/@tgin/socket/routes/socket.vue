<template>
  <q-page class="q-mt-lg q-mb-xl">

    <CLayout>

      <div class="q-gutter-md">

        <q-btn
            label="Connect"
            @click="onConnect"
        />

        <q-btn
            label="Disconnect"
            @click="onDisconect"
        />


        <q-btn
            label="Message"
            @click="$ws.send('ZZZZZZ')"
        />

        <q-btn
            label="Ping"
            @click="onPing"
        />

      </div>

    </CLayout>

  </q-page>
</template>

<script>
import CLayout from '~app/layout/site/page/1cols'
import MRoute from "~app/mixin/route-public";

export default {
  mixins: [MRoute],
  components: {
    CLayout,
  },

  data() {
    return {
      navLoading: false,
      navTimeout: null,
      page: {
        title: 'Отзывы'
      },
    }
  },
  created() {
    this.$bus.on('socket:ping', this.onPingRecieve)
  },
  computed: {},
  watch: {},
  methods: {
    onPingRecieve(data) {

      console.log(data)
    },

    onConnect() {
      this.$ws.connect()
    },

    onDisconect() {
      this.$ws.disconect()
    },

    async onPing() {

      let {data} = await this.$apollo.mutate({
        mutation: require('../gql/mutation/ping.gql'),
        variables: {},
      })

      console.log(data)

    },
  },
}
</script>
<style lang="scss" scoped>


</style>
