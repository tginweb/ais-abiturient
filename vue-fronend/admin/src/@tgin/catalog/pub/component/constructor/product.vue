<template>

  <div
      class="com-product cursor-pointer"
      @click="onClick"
      :class="{
        'selected': !!quantity
      }"
  >

    <template v-if="quantity && isSectionMultiple">
      <div class="c-quantity s-font-md">
        x {{ quantity }}
      </div>
      <q-btn
          class="c-minus"
          round
          color="red"
          :icon="$icons.minus"
          size="8px"
          @click.stop="onMinus"
      />
    </template>

    <div
        class="c-image q-mb-sm"
        style="line-height:0;"
    >
      <img
          :src="entity.LIST_IMAGE.SRC"
          v-if="entity.LIST_IMAGE"
      />
    </div>

    <div class="text-center">
      <div>{{ entity.NAME }}</div>
      <div>{{ $util.format.price(entity.PRICE.PRICE) }}</div>
    </div>
  </div>

</template>

<script>

export default {
  props: {
    entity: {},
    quantity: {default: 0},
    max: {},
    section: {}
  },
  data() {
    return {
      currentSectionId: null
    }
  },

  computed: {
    isSectionMultiple() {
      return this.section.PROP.MULTIPLE && this.section.PROP.MULTIPLE.VAL
    }
  },
  methods: {
    onClick() {
      this.$emit('select')
    },
    onMinus() {
      this.$emit('minus')
    },
  }
}
</script>
<style lang="scss" scoped>

.com-product {
  position: relative;

  .c-image {
    border: 1px solid #EEE;
  }

  &.selected {
    .c-image {
      border: 2px solid  $primary;
    }
  }
}

.c-quantity {
  position: absolute;
  left: 5px;
  top: 3px;
  font-weight: 500;
  line-height: 1;
  color: #ce8714;
}

.c-minus {
  position: absolute;
  right: -10px;
  top: -10px;
  z-index: 2;
  margin: 0;
}

</style>
