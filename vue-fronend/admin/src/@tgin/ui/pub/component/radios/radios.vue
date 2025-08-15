<template>
  <div class="q-gutter-xs">

    <q-list>

      <q-item
          v-for="(item, index) of items"
          :key="item.ID"
          class="q-px-none items-start"
          manual-focus
          tag="label"
      >
        <q-item-section class="col-shrink q-mr-sm">
          <q-radio v-model="valueState" :val="item[optionValue]" color="teal" dense/>
        </q-item-section>

        <q-item-section>

          <q-item-label>
            {{ item[optionLabel] }}
          </q-item-label>

          <q-item-label v-if="item[optionCaption]" caption v-html="item[optionCaption]"/>

        </q-item-section>

      </q-item>

    </q-list>

  </div>
</template>

<script>

export default {
  props: {
    items: {},
    value: {},
    'optionLabel': {
      default: 'NAME'
    },
    'optionValue': {
      default: 'VALUE'
    },
    'optionImage': {
      default: 'IMAGE'
    },
    'optionCaption': {
      default: 'CAPTION'
    },
  },
  components: {},
  data() {
    return {
      valueState: this.value
    }
  },
  watch: {
    value() {
      this.valueState = this.value
    },
    valueState(val) {
      this.$emit('input', val)
    },
  },
  methods: {}
};
</script>

<style lang="scss" scoped>


</style>
