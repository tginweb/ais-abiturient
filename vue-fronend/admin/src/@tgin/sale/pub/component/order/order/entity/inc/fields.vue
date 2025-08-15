<template>

  <div class="c-fields">

    <div
      v-for="(field, fieldIndex) of fields"
      v-if="field.VALUE || field.VALUE_HTML || (field.VALUES && field.VALUES.length)"
      :key="fieldIndex"
      class="c-field q-mb-md qx-mb-last-none"
    >
      <div class="text-primary-brown-gray-3">{{ field.NAME }}</div>
      <div>
        <template v-if="field.VALUES">
          <div
            v-for="(fieldValue, fieldValueIndex) of field.VALUES"
            :key="fieldValueIndex"
          >
            {{ fieldValue }}
          </div>
        </template>
        <div v-else-if="field.VALUE">
          {{ field.VALUE }}
        </div>
        <div v-else-if="field.VALUE_HTML"  v-html="field.VALUE_HTML"/>
      </div>
    </div>

  </div>


</template>

<script>

export default {
  props: {
    fields: {},

  },
}
</script>

<style lang="scss" scoped>

.c-status__line {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 1px;
}

</style>
