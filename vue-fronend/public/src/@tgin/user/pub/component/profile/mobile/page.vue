<template>
  <div>

    <div class="q-mb-md" style="border-bottom: 3px solid #eee;">
      <ui-menu-route-tabs
          v-if="menuItems"
          :dense="true"
          :items="menuItems"
          align="justify"
          class="c-menu-tabs"
          active-class="text-primary"
          item-class="q-px-sm q-py-xs"
          indicator-color="transparent"
      />
    </div>

    <CHeader
      :title="title"
      :path="path"
      class="q-px-md"
    />

    <div style="border-bottom1: 1px #ddd solid;">
      <slot/>
    </div>

    <div
        v-if="actionsByPosition.bottom && actionsByPosition.bottom.length"
        class="q-gutter-y-sm q-gutter-x-md q-py-md q-px-md "
    >

      <q-btn
          v-for="(action, index) of actionsByPosition.bottom"
          :key="index"
          :icon="$icons[action.icon] || action.icon"
          :color="action.color || 'primary-brown-1'"
          :disable="!!action.disable"
          :flat="action.flat || false"
          :label="action.label"
          :text-color="action.textColor || (!action.color ? 'dark' : null)"
          :outline="action.outline"
          class=""
          unelevated
          @click="onMenuItemClick(action)"
      />

    </div>

  </div>
</template>

<script>

import CHeader from './header'
import CPage from '../shared/page'

export default {
  extends: CPage,
  props: {
  },
  components: {
    CHeader
  },


}

</script>

<style lang="scss" scoped>
.c-menu-tabs {
  /deep/ {
    .q-tab__icon {
      width: 16px;
      height: 16px;
    }
  }
}

</style>
