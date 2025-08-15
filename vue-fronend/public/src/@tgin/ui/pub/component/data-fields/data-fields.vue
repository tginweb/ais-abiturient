<template>

    <q-list class="__items">

      <q-item
          class="__item"
          v-for="(item, index) of items"
          :key="index"
      >
        <q-item-section class="__title">
          {{item.label}}
        </q-item-section>
        <q-item-section class="__value" side>
          <div v-html="item.value"/>
        </q-item-section>
      </q-item>

    </q-list>

</template>

<script>


export default {
  props: {
    value: {
      default: () => ([])
    }
  },
  data() {
    return {

    }
  },
  computed: {

    items() {
      return this.value.filter(item => !!item.value)
    }
  },
};
</script>
<style lang="scss" scoped>


</style>
