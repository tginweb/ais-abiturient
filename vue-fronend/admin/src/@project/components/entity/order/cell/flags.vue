<template functional>

  <div :class="data.staticClass || ''" v-bind="data.attrs" class="q-gutter-sm">

      <q-badge color="green-5" title="Иностранец" v-if="props.row.anket.fields.personal.citizenship==='other'">
         ИНОСТР
      </q-badge>

     <q-badge color="green-5" title="Индивидуальные достижения" v-if="props.row.anket.fields.entrance.achievements && props.row.anket.fields.entrance.achievements.length">
         ИД
     </q-badge>

     <q-badge color="green-5" title="Есть льготы" v-if="props.row.anket.fields.benefits.quotes && props.row.anket.fields.benefits.quotes.length">
         Льгота
     </q-badge>

  </div>

</template>

<script>
  export default {
    functional: true,
    props: {
      row: {},
    },
  }
</script>

<style lang="scss" scoped>


</style>
