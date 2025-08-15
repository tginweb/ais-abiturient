<template functional>

  <span :class="data.staticClass || ''" class="" v-bind="data.attrs">

     {{parent.getTermByNid('abit.eduInstitute', props.row.instituteNid, 'name')}}

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
