<template>

  <q-list
      v-if="items && items.length"
      class="c-menu"
  >
    <q-item
        v-for="(item, index) of items"
        :key="item.url"
        :class="{
          'c-menu__item': true,
          [itemClass]: true
        }"
        clickable
        exact
        manual-focus
        @click="onClickItem(item)"
    >

      <q-item-section
          v-if="item.icon"
          :class="iconClass"
          avatar
      >
        <q-icon :name="$icons[item.icon] || item.icon"/>
      </q-item-section>

      <q-item-section>

        <div>
          <span>{{ item.label || item.label }}</span>
        </div>

      </q-item-section>

      <q-item-section class="q-mr-sm" side>
        <div class="flex items-center">
          <div
              v-if="item.count"
              class="q-mr-md text-primary-brown-gray-4"
          >
            {{ item.count }}
          </div>

          <q-icon
              :name="$icons.chevronRight"
              color="primary-brown-gray-3"
              size="12px"
          />
        </div>
      </q-item-section>

    </q-item>
  </q-list>

</template>

<script>

export default {
  components: {},
  props: {
    items: {default: () => ([])},
    dense: {default: false},
    itemClass: {},
    iconClass: {},
    icon: {default: true},
    chevron: {default: true},
    counter: {default: true},
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    onClickItem(item) {
      if (this.$route.fullPath === item.url) {
        this.$emit('close')
      }
      this.$store.dispatch('command/runMenuItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
