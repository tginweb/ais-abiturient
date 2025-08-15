<template>

  <div class="com" v-if="false">

  </div>

</template>

<script>


export default {
  props: {},
  data() {
    return {
      opened: [],
      schema: {
        error: {
          color: 'red',
          icon: this.$icons.fasExclamationCircle
        },
        success: {
          color: 'green',
          icon: this.$icons.farCheckCircle
        },
        warning: {
          color: 'yellow-8',
          icon: this.$icons.fasExclamationCircle
        },
      }
    }
  },

  watch: {},
  methods: {

    onProcessMessage(message) {
      this.closeOpened()

      const theme = this.schema[message.type || 'success'] || {}

      this.opened.push(this.$q.notify({
        ...theme,
        ...message,
        type: null,
        html: true,
        position: "bottom-right",
      }))
    },

    onProcessMessages(messages) {

      const notifyMessages = messages ? messages.filter(message => {
        return true
      }) : []

      if (notifyMessages.length) {
        this.process(messages)
      }
    },

    process(messages) {
      this.closeOpened()
      messages.forEach((message) => {
        const theme = this.schema[message.type || 'success'] || {}
        this.opened.push(this.$q.notify({
          ...theme,
          ...message,
          type: null,
          html: true,
          position: "bottom-right",
        }))
      })
    },

    closeOpened() {
      this.opened.forEach((dismiss) => {
        dismiss()
      })

      this.opened = []
    }

  },
  mounted() {
    this.$bus.on('processMessages', this.onProcessMessages);
    this.$bus.on('processMessage', this.onProcessMessage);
  },
  beforeDestroy() {
    this.$bus.off('processMessages', this.onProcessMessages);
    this.$bus.off('processMessage', this.onProcessMessage);
  },
}

</script>

<style lang="scss" scoped>


</style>
