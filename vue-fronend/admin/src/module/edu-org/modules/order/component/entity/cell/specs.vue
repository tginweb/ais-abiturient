<template >

  <div class="">
    <ul>
      <template v-for="app of row.applications.items">
        <li v-for="app of app.specsAdmissions">
          {{app.abbr}} {{app.spec_name}}
        </li>
      </template>
    </ul>
  </div>

</template>

<script>

  export default {
    props: {
      row: {},
    },
    computed: {
      app() {
        return this.row.firstApp ? this.row.firstApp : null
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
