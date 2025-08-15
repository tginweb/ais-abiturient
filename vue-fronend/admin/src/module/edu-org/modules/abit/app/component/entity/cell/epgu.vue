<template functional>

  <div :class="data.staticClass || ''" class="" v-bind="data.attrs" v-if="props.row.epgu">

    <div v-if="props.row.epgu.id">
      ID: {{ props.row.epgu.id }}
    </div>
    <div v-else>
      нет в епгу
    </div>
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
