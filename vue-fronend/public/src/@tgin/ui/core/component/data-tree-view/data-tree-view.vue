<template>

  <div>
    <q-tree
        :nodes="data"
        children-key="children"
        label-key="label"
        node-key="label"
        selected-color="primary"
        :expanded.sync="expandedState"
    >
      <template v-slot:default-header="prop">
        <div class="flex items-center full-width q-pb-xs no-wrap" style="border-bottom1: 1px dotted #eee">
          <div class="text-weight-bold">{{ prop.node.label }}</div>
          <div class="q-ml-auto text-right">{{ prop.node.value }}</div>
        </div>
      </template>

    </q-tree>
  </div>

</template>

<script>

export default {
  components: {

  },
  props: {
    data: {},
    expanded: {},
  },
  data() {
    return {
      expandedState: this.expanded
    }
  },

}
</script>
<style lang="scss" scoped>


</style>
