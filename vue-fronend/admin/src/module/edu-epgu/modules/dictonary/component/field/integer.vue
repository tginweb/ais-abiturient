<template>

  <div>


    <ui-input-select
        v-if="cls"
        v-model="valueState"
        :label="label"
        outlined
        :rules="rules"
        :options="options"
        option-value="id"
        option-label="name"
        map-options
        emit-value
        :loading="loading"
    />
    <q-input
        v-else
        v-model="valueState"
        :label="label"
        outlined
        :rules="rules"
    />
  </div>

</template>

<script>
import Parent from './base'
export default {
  extends: Parent
}
</script>

<style lang="scss" scoped>


</style>
