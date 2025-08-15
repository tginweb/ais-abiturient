<template>

  <q-tr>
    <q-td
        :colspan="props.cols.length + (actionsColumnEnable?1:0)+(selectionType && selectionType !== 'none'?1:0)"
        class="text-weight-bold"
    >
      <component
          v-if="props.row.com"
          :is="props.row.com"
          :row="props.row.row"
      />
      <div v-else>
        {{props.row.value}}
      </div>

    </q-td>
  </q-tr>

</template>

<script>


export default {
  components: {

  },

  props: {
    props: {},
    selectionType: {},
    rowExpandedCom: {},
    gridActive: {},
    rowOpener: {},
    onRowOpen: {},
    rowMenuComp: {},
    onRowClick: {},
    onRowDblClick: {},
    actionsColumnEnable: {},
    onRowAction: {},
    focusedRowState: {}
  },
  data() {
    return {

    }
  },
  mounted() {


  },
  created() {

  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>

.c-header {
  /deep/ .q-icon {
    font-size: 18px;
  }
}

.c-row-actions-btn {
  line-height: 1rem;

  /deep/ .q-btn__wrapper {
    min-height: 1em;
  }
}


</style>
