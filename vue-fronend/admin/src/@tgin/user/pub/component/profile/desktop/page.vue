<template>
  <div>

    <div class="q-px-lg">

      <CHeader
          :title="title || 'Личный кабинет'"
          :path="path"
          class="q-mb-sm q-mt-md"
      />

      <div class="q-mb-lg " style="border-bottom: 3px solid #eee;">

        <ui-menu-route-tabs
            v-if="menuItems"
            :value="activeMenuItemTab"
            :dense="true"
            :items="menuItems"
            align="justify"
            class="c-menu-tabs"
            active-class="text-primary"
            item-class="q-px-sm q-px-xl-none"
            indicator-color="transparent"
            :path="path"
        />

      </div>

      <ui-progress-inner-loading
          :value="loading"
      />

      <template v-if="loaded">
        <slot/>
      </template>

      <div
          v-if="actionsByPosition.bottom && actionsByPosition.bottom.length"
          class="q-gutter-y-sm q-gutter-x-md q-pt-md"
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


  </div>
</template>

<script>

import CHeader from '../shared/header'
import CPage from "../shared/page";

export default {
  extends: CPage,
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
