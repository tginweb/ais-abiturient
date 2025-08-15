<template>

  <div>

    <div
        :class="region.outerClass"
        :key="regionIndex"
        v-for="(region, regionIndex) in regions"
    >

      <div :class="region.class">

        <div :class="region.innerClass">

          <component
              :index="(regionIndex + 1 ) + '-' + ( itemIndex + 1)"
              :item="item"
              :key="itemIndex"
              v-bind="bindRegionItem(region, item, itemIndex)"
              v-for="(item, itemIndex) in regionItems(regionIndex)"
          >
          </component>

        </div>

      </div>

    </div>

  </div>


</template>

<script>
import Items from './items'

import {classExtend, classToString} from "@tgin/main/common/lib/util/html";

export default {
  extends: Items,
  props: {
    regions: {},
  },
  methods: {

    regionItems(regionIndex) {

      let usedCount = 0

      for (let i = 0; i < regionIndex; i++) {
        usedCount += this.regions[i].limit
      }

      return this.items.slice(usedCount, usedCount + this.regions[regionIndex].limit)
    },

    bindRegionItem(region, item, index) {

      let res = region.item || {}

      res = {
        ...region.item || {},
        class: classToString(region.item.class),
        style: classToString(region.item.style),
        contentClass: classExtend({}, region.item.contentClass),
      }

      return res
    }

  },

}
</script>

<style lang="scss" scoped>


</style>
