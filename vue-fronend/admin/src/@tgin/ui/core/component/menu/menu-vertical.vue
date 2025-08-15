<template>

  <component
      v-bind="rootBindComp"
  >

    <q-list
        :dense="rootDense"
        class="c-menu"
    >
      <q-item
          v-for="(item, index) of itemsCompVert"
          :key="item.id"
          v-bind="item.bind"
          clickable
          manual-focus
          @click="onItemClick(item)"
      >
        <q-item-section
            v-if="item.icon"
            :class="rootIconClass"
            avatar
        >
          <q-icon :name="item.icon ? $icons[item.icon] : 'img:' + item.icon"/>
        </q-item-section>

        <q-item-section>

          <span>{{ item.label }}</span>

        </q-item-section>

        <q-item-section class="q-mr-sm" side>

          <div class="flex items-center">

            <div
                v-if="item.count"
                class="q-mr-md text-primary-brown-gray-4"
            >
              {{ item.count }}
            </div>

          </div>
        </q-item-section>

      </q-item>

    </q-list>

  </component>

</template>

<script>

import CBase from './menu-toolbar/base'

export default {
  extends: CBase
}
</script>

<style lang="scss" scoped>

.q-item {
  min-height: auto;
}

.q-item.q-router-link--active {
  font-weight: 700;
  color: #59534f;
}


</style>
