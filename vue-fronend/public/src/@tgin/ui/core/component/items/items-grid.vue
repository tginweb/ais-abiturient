<template>

  <div class="query-items query-items-grid">

    <div v-bind="bindRow">

      <component
          v-for="(item, index) in items"
          :key="item.ID"
          v-bind="bindItem(item, index)"
          :index="index"
      />

    </div>

  </div>

</template>

<script>
import Items from './items'
import {classExtend, styleExtend} from "@tgin/main/common/lib/util/html";

export default {
  extends: Items,

  computed: {
    bindRow() {

      let res = {
        class: classExtend(['row'], this.rowClass, true),
        style: styleExtend({}, this.rowStyle, true),
      }

      return res
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
