<template>

  <div>

    <template v-if="$store.state.router">
      <component
          :is="vroute.is"
          v-for="(vroute, index) of $store.state.router.vroutes"
          :key="vroute.uid"
          :ref="'vroute-'+index"
          v-bind="vroute.props"
          :vrouter-index="index"
          :vrouter-uid="vroute.uid"
          vrouter-type="dialog"
          @event="onVrouteEvent(arguments, index)"
          :default-dialog-is="defaultDialogIs"
          :default-page-is="defaultPageIs"
      />
    </template>

  </div>

</template>
<script>


export default {
  props: {
    defaultDialogIs: {},
    defaultPageIs: {},
  },
  data() {
    return {

    }
  },
  computed: {


  },
  methods: {

    onVrouteEvent(args, index) {

      this.$bus.emit.apply(this.$bus, ['vroute.event.' + args[0], ...Array.prototype.slice.call(args, 1)])

      /*
      for (let i = 0; i < index; i++) {
        const com = this.$refs['vroute-' + i] && this.$refs['vroute-' + i][0]

        if (com) {

          if (args[0] === 'entity' && com.onChildEntityEvent) {
            com.onChildEntityEvent.apply(com, Array.prototype.slice.call(args, 1))
          }

          if (com.onChildEvent)
            com.onChildEvent.apply(com, args)
        }
      }

       */
    },
  }
}
</script>
