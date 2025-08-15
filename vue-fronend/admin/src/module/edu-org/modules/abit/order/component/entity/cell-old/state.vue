<template functional>

  <span :class="data.staticClass || ''" class="" v-bind="data.attrs">

    <span class="c-status-title q-mb-xs" v-bind="$options.bindStatus(props.row, parent.$store)">
      {{parent.$store.getters['abit/orderStatusField'](props.row.state.status, 'titleAdmin')}}
    </span>

    <div class="c-step-title text-grey-7" v-if="props.row.state.status=='draft'" style="font-size: 90%;">
      Шаг: {{props.row.lastDoneStep && props.row.lastDoneStep.title}}
    </div>

  </span>

</template>

<script>

    export default {
        functional: true,
        props: {
            row: {},
        },
        bindStatus(row, store) {
          let res = {
            class: {},
            style: {}
          }
          let statusInfo = store.getters['abit/orderStatusesInfoByCode'][row.state.status]

          if (statusInfo) {
            res.style.color = statusInfo.color
          }

          return res
        }
    }
</script>

<style lang="scss" scoped>


</style>
