<template>

  <div class="q-gutter-sm s-font-xs" style="line-height:1;">

    <div class="flex no-wrap q-gutter-sm items-center" v-if="row.PROPS_BY_CODE.PHONE && row.PROPS_BY_CODE.PHONE.VALUE">
      <q-icon :name="$icons.fasPhone"/>

      <div>{{ row.PROPS_BY_CODE.PHONE.VALUE }}</div>
    </div>

    <div class="flex no-wrap q-gutter-sm items-center" v-if="row.PROPS_BY_CODE.EMAIL && row.PROPS_BY_CODE.EMAIL.VALUE">
      <q-icon :name="$icons.fasEnvelope"/>

      <div style="max-width: 200px; text-overflow: ellipsis;overflow:hidden;">{{ row.PROPS_BY_CODE.EMAIL.VALUE || (row.USER ? row.USER.EMAIL : '') }}</div>
    </div>

    <div v-if="row.USER" class="flex no-wrap q-gutter-sm items-center">

      <q-icon :name="$icons.fasUser"/>

      <div>пользователь №{{ row.USER.ID }}</div>

    </div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
}
</script>

<style lang="scss" scoped>


</style>
