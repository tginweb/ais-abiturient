<template>

  <div class="com">

    <component
      :is="dialog"
      v-for="(dialog, index) of allDialogs"
      v-if="$store.getters['dialogVisible'](dialog.split('__').join('/'))"
      v-bind="$store.getters['dialogProps'](dialog.split('__').join('/')) || {}"
      :key="dialog"
    />


    <Keypress
      v-for="keypressEvent in keypressEvents"
      :key="keypressEvent.id"
      :key-event="keypressEvent.keyEvent"
      :multiple-keys="keypressEvent.multipleKeys"
      @success="onKeypress"
    />

  </div>

</template>

<script>

import * as dialogs from '~app/component/dialog'

let allDialogs = [];

Array.prototype.push.apply(allDialogs, Object.keys(dialogs));

export default {
  components: {

  },
  data() {
    return {
      keypressEvents: [
        {
          keyEvent: 'keydown',
          multipleKeys: [
            {
              keyCode: 69, // A
              modifiers: ['altKey'],
              preventDefault: true,
            },
          ],
        },
      ],
      adminMenuOpened: false
    }
  },
  mounted() {
    this.$bus.on('loadingStart', this.onLoadingStart);
    this.$bus.on('loadingStop', this.onLoadingStop);

    this.$bus.on('nav', this.onNav);
  },
  beforeDestroy() {
    this.$options.allDialogs = null

    this.$bus.off('loadingStart', this.onLoadingStart);
    this.$bus.off('loadingStop', this.onLoadingStop);

    this.$bus.off('nav', this.onNav);
  },
  methods: {

    onNav(op, props = {}) {

      const schema = {
        'user/profile_edit': {
          dialog: true,
        }
      }

      let info;

      if (info = schema[op]) {

        if (info.dialog) {

          const dialogPath = typeof info.dialog === 'string' ? info.dialog : op

          this.$store.dispatch('dialogShow', [dialogPath, props])
        }
      }
    },

    onLoadingStart(opt) {
      console.log('LOADING')
      this.$q.loading.show(opt)
    },
    onLoadingStop() {
      this.$q.loading.hide()
    },
    onKeypress(r) {

      this.adminMenuOpened = !this.adminMenuOpened

    }
  },
  computed: {
    allDialogs() {
      return allDialogs
    }
  }
}

</script>

<style lang="scss">


</style>
