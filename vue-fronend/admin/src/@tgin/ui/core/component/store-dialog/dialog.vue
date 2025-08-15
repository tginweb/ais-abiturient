<template>


</template>

<script>

export default {
  data() {
    return {
      dialogModule: '',
      dialogName: '',
      state: {},
      updateStoreState: false
    }
  },

  created() {
    this.state = this.$util.base.cloneDeep(this.$store.state[this.dialogModule].dialog[this.dialogName].state)
  },
  watch: {
    state: {
      handler: function (val) {
        this.updateStoreState = true
        this.$store.dispatch('dialogStateSet', [this.dialogId, this.$util.base.cloneDeep(val)])
      },
      deep: true
    },
    storeState: {
      handler: function (val) {
        if (this.updateStoreState) {
          this.updateStoreState = false
          return
        }
        this.state = val
      },
      deep: true
    },
    visible(val) {

    }
  },
  computed: {

    dialogId() {
      return this.dialogModule + '/' + this.dialogName
    },

    visible: {
      get() {
        return this.$store.state[this.dialogModule].dialog[this.dialogName].value;
      },
      set(value) {
        // if (!value) this.$store.dispatch('dialogUpdate', [this.dialogId, {}])
        this.$store.dispatch('dialogSetVisible', [this.dialogId, value])
      }
    },
    storeState: {
      get() {
        return this.$util.base.cloneDeep(this.$store.state[this.dialogModule].dialog[this.dialogName].state);
      },
      set(value) {
        this.$store.dispatch('dialogStateSet', [this.dialogId, value])
      }
    },
  },
  methods: {

    setState(key, value = null, deep = false) {

      let update = {}

      if (typeof key === 'object')
        update = key
      else if (typeof key === 'string')
        update[key] = value

      this.$store.dispatch('dialogStateAssign', [this.dialogId, update, deep])
    },

    hide() {
      this.$store.dispatch('dialogHide', [this.dialogId])
    }
  }
}

</script>

<style lang="scss">


</style>
