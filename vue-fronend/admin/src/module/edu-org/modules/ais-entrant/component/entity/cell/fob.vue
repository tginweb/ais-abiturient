<template>
    <div class="q-gutter-y-md">
      <ul class="q-py-none q-pl-sm">
        <li v-for="fob in fobs">
          {{fobTitle[fob]}}
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

    fobTitle() {
      return {
        1: 'Очная',
        2: 'Заочная',
      }
    },
    fobs() {
      return Object.keys(this.row.apps.reduce((map, app) => {
        map[app.cfob] = app.cfob
        return map
      }, {}))
    }
  }
}
</script>

<style lang="scss" scoped>



</style>
