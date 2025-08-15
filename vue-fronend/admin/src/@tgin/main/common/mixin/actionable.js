export default {
  props: {},
  data() {
    return {
      actionResponse: {
        result: {},
        payload: {},
      },

      alertMessagesEngine: 'toast',

      notifies: []
    }
  },
  created() {

  },
  computed: {
    isActionError() {
      return this.actionResponse && this.actionResponse.result ? !this.actionResponse.result.success : false
    },
    actionResultMessages() {
      return this.actionResponse && this.actionResponse.result && this.actionResponse.result.messages || []
    },
    actionResultAlertMessages() {
      return this.actionResultMessages
    },
  },
  watch: {

    actionResultAlertMessages(items) {

      this.notifies.forEach((notify) => {
        notify()
      })

      this.notifies = []

      const typesToNotify = {
        error: {
          type: 'negative'
        },
        success: {
          type: 'positive'
        }
      }

      items.forEach(item => {

        const notify = typesToNotify[item.type]

        this.notifies.push(this.$q.notify({
          type: notify.type,
          message: item.message
        }))
      })

    }
  },
  methods: {
    setActionResponse(res) {
      this.$set(this.actionResponse, 'result', res.result)
      this.$set(this.actionResponse, 'payload', res.payload)
    },
    resetActionResponse() {
      this.$set(this.actionResponse, 'result', {})
      this.$set(this.actionResponse, 'payload', null)
    },
  },
}

