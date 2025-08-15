<template>

 <q-input
    v-model="valueState"
    :label="label"
    outlined
    :rules="rules"
 />

</template>

<script>
import Parent from './base'
export default {
  extends: Parent
}
</script>

<style lang="scss" scoped>


</style>
