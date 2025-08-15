<template>

  <div>
    <ui-input-date
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
