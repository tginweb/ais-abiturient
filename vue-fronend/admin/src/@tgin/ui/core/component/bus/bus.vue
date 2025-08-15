<template>

  <div class="com" v-if="false">

  </div>

</template>

<script>


export default {

  methods: {
    onProcessResponse(res) {

      let error

      if (res.messages) {
        this.$bus.emit('processMessages', res.messages);
        error = res.messages.find(item => item.type === 'error')
      }

      if (res.events) {

        const eventsGrouped = res.events.reduce((map, event) => {
          this.$bus.emit(event.name, event.args)
          map[event.name] = event
          return map
        }, {})

        for (const [eventName, event] of Object.entries(eventsGrouped)) {
          this.$bus.emit('group:' + event.name, event.args)
        }
      }

      return {
        error
      }
    },

    onProcessMessages(messages) {

      const error = messages.find(item => item.type === 'error')

      if (error) {
        if (error.category === 'access') {
          if (error.errorType === 'auth' || error.name === 'NOT_AUTHORIZED') {


            this.$router.push({name: 'user:auth'})
          }
        }
      }

    },

  },
  mounted() {
    this.$bus.on('processResponse', this.onProcessResponse);
    this.$bus.on('processMessages', this.onProcessMessages);
  },
  beforeDestroy() {
    this.$bus.off('processResponse', this.onProcessResponse);
    this.$bus.off('processMessages', this.onProcessMessages);
  },
  computed: {
    httpClientContext() {
      return this.$store.getters['httpClientContext']
    }
  },
  watch: {
    httpClientContext(data) {
      this.$store.commit('HTTP_HEADERS', {httpClientContext: data})
    }
  }
}

</script>

<style lang="scss" scoped>

.com {
  .__item {
    /deep/ {
      .q-banner__content {
        font-size: 17px;
      }
    }
  }

  .__item-rows {
    li:last-child {
      margin-bottom: 0;
    }
  }
}

</style>
