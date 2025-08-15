<template functional>

  <span :class="data.staticClass || ''" class="" v-bind="data.attrs">


    <ul class="q-ma-none text-left" style="padding: 0 0 0 10px">
      <li v-for="app of props.row.applications.fields.applications">
        <span v-if="parent.$store.getters['abit/eduProgramsPreparedByNid'][app.eduProgramNid]">
          {{parent.$store.getters['abit/eduProgramsPreparedByNid'][app.eduProgramNid].abbr}}
        </span>
      </li>
    </ul>

  </span>

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
