<template>
    <div class="q-gutter-y-md">

      <ul class="q-py-none q-pl-sm">
        <li v-for="(sourceName,source) of sources">
          {{sourceName}}
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

    sources() {
      return this.row.apps.reduce((map, app) => {
        map[app.source.id] = app.source.nameShort
        return map
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>



</style>
