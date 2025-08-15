<template>

  <div>

    <q-input v-mode="args.snils"/>

    <q-input v-mode="args.appId"/>

  </div>

</template>

<script>

export default {
  props: {
    selectionType: {default: 'multiple'}
  },
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
