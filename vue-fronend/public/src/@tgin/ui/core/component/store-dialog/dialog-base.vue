<template>


</template>

<script>

export default {
  methods: {

    emits(event, eventData) {
      if (this.payload.emitter)
        this.payload.emitter(event, eventData)
    },

    dialogDataUpdate(data) {
      this.$store.dispatch('dialogUpdate', [this.dialogId, data])
    },

    hide() {
      this.$store.dispatch('dialogHide', [this.dialogId])
    }
  }
}

</script>

<style lang="scss">


</style>
