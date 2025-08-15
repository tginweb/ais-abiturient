<template>

  <q-list class="c-options q-mt-md">

    <q-item
      v-for="(item, index) of options"
      :key="index"
      v-ripple
      class="q-px-none "
      manual-focus
      tag="label"
    >

      <q-item-section avatar>
        <q-radio v-model="valueState" :val="item.VALUE" color="teal"/>
      </q-item-section>

      <q-item-section >
        {{item.NAME}}
      </q-item-section>

    </q-item>

  </q-list>


</template>

<script>

export default {
  props: {
    order: {},
    options: {}
  }
}
</script>
<style lang="scss" scoped>


</style>
