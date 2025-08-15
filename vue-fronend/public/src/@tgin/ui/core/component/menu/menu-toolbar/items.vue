<template>

  <component
      v-bind="rootBindComp"
      anchor="top end"
      self="top start"
  >

    <q-list dense style="min-width: 100px">


      <template
          v-for="(item, index) of items"
      >
        <q-item
            v-if="item.children && item.children.length"
            clickable
            class="c-item"
        >

          <q-item-section
              v-if="item.icon"
              avatar
              class="q-pr-md"
              style="min-width: auto;"
          >
            <q-icon
                :name="$icons[item.icon] || item.icon"
                color="primary"
            />
          </q-item-section>

          <q-item-section>{{ item.label }}</q-item-section>

          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>

          <Items
              :items="item.children"
              anchor="top end"
              self="top start"
              @click="$emit('click', $event)"
          />

        </q-item>

        <q-item
            clickable
            v-close-popup
            :key="index"
            @click="$emit('click', item)"
            v-else
            class="c-item"
        >
          <q-item-section
              v-if="item.icon"
              avatar
              class="q-pr-md"
              style="min-width: auto;"
          >
            <q-icon
                :name="$icons[item.icon] || item.icon"
                color="primary"
            />
          </q-item-section>
          <q-item-section>
           {{item.label}}
          </q-item-section>
        </q-item>

      </template>

      <q-separator/>

    </q-list>

  </component>

</template>

<script>


export default {
  name: 'Items',
  props: {
    rootBind: {
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    model: {
      type: Boolean,
      default: true
    },
    appendTo: {
      type: String,
      default: null
    },
    autoZIndex: {
      type: Boolean,
      default: true
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    exact: {
      type: Boolean,
      default: true
    },

    labelKey: {
      type: String,
      default: 'name'
    },
    urlKey: {
      type: String,
      default: 'url'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    callbackKey: {
      type: String,
      default: 'callback'
    },
    iconKey: {
      type: String,
      default: 'icon'
    },
    callback: {},
  },
  components: {

  },
  data() {
    return {};
  },
  computed: {
    rootBindComp() {
      const res = {
        is: 'q-menu',
        ...this.rootBind
      }

      return res
    }
  }

}
</script>

<style>

.c-item {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
</style>
