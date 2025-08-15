<template>

  <div>

    <ul>
      <li v-for="(location, index) of row.locations" :key="index">
       <b>{{location.id}}</b> {{ $util.date.timestampToFormat(location.date, 'datetime') }} - {{location.place}}
      </li>
    </ul>
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
