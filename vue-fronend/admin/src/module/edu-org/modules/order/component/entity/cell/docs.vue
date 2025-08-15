<template>

  <div class="">
    <ul>
      <li
          v-for="doc of row.docs.filter(doc => doc.type === 'lgot')"
          :key="doc.id"
      >
        {{doc.docTypeName}}
      </li>
    </ul>
  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {
    title() {
      return this.row.anket.personal
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
