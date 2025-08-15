<template>

  <div class="q-gutter-sm">

    <div>
      OMail: {{row.anket.personal.email}}<br>
      UMail: {{row.user && row.user.email}}<br>
    </div>

     <q-badge color="green-5" v-if="row.user && (row.user.email!==row.anket.personal.email)">
         не равны
     </q-badge>

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
