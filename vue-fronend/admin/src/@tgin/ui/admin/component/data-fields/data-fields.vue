<template>

  <q-list class="com">

    <slot name="items"/>

    <q-item
        class="__item"
        v-for="(item, index) of items"
        :key="index"
    >

      <q-item-section
          class="__title"
          :style="{
            width: labelWidth,
            minWidth: labelWidth,
          }"
      >
        {{ item.label }}
      </q-item-section>

      <q-item-section class="__value" side>

        <slot
            :name="'value-' + item.name"
            v-bind="{item}"
            v-if="$scopedSlots['value-' + item.name]"
        />

        <div class="__value_inner" v-else>

          <router-link
              v-if="item.to"
              :to="item.to"
              :class="item.valueClass"
              :style="item.valueStyle"
          >
            <div v-html="item.value"/>
          </router-link>

          <span
              v-else
              v-html="item.value"
              :class="item.valueClass"
              :style="item.valueStyle"
          />

        </div>

      </q-item-section>

    </q-item>

  </q-list>

</template>

<script>


export default {
  props: {
    value: {
      default: () => ([])
    },
    labelWidth: {
      default: '160px'
    }
  },
  data() {
    return {}
  },
  computed: {
    items() {
      return this.value.filter(item => !!item.value || this.$scopedSlots['value-' + item.name])
    }
  },
};
</script>
<style lang="scss" scoped>

a {
  text-decoration: none;
}

.com {
  /deep/ {
    .__item {
      padding-left: 0;
      padding-right: 0;
      min-height: auto;

      &:not(:last-child) {
        border-bottom: 1px dotted #ddd;
      }
    }

    .__title {
      justify-content: start;
      color: #777;
      flex: none;
    }

    .__value {
      text-align: left;
      justify-content: start;
      color: #111;

      .__value_inner {
        max-width: 100%;

        span {
          text-overflow: ellipsis;
          overflow: hidden;
          display: block;
          max-width: 100%;
        }
      }
    }

    @media (max-width: $breakpoint-sm-max) {

      .__item {
        display: block;
      }

      .__title {
        width: 100%;
      }

      .__value {
        width: 100%;
        align-items: normal;
        padding-left: 0;
      }
    }
  }
}


</style>
