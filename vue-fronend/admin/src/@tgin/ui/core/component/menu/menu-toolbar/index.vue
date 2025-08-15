<template>

  <component
      v-bind="rootBindComp"
  >

    <template
        v-for="(item, index) of itemsComp"
    >
      <component
          v-bind="item.bind"
          :key="index"
          v-if="item.children && item.children.length"
      >
        <MenuItems
            :root-bind="itemsBindComp"
            :items="item.children"
            v-if="item.children && item.children.length"
            :callback="callback"
            @click="onItemClick"
        />
      </component>

      <component
          v-bind="item.bind"
          :key="index"
          @click="onItemClick(item)"
          v-else
      />

    </template>

  </component>

</template>

<script>

import CBase from './base'
import {QBtnGroup} from 'quasar'

export default {
  extends: CBase,
  components: {
    QBtnGroup
  }
}
</script>

<style lang="scss" scoped>

.q-btn {

  /deep/ {
    .q-btn__content {
      flex-wrap: nowrap;
    }
  }
}

</style>
