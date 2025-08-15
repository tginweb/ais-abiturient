<template>
  <q-page class="">

    <layout-cab-page-header
      title="Уровни образования"
    />

    <CList
      :query="() => require('../gql/query/listRecordset.gql')"
      @focusedRow="onFocusedRow"
    />

  </q-page>
</template>

<script>

import CRoute from "~module/app/component/route";
import CList from "../component/entity/list/list";

export default {
  extends: CRoute,
  components: {
    CList
  },
  apollo: {},
  data() {
    return {
      page: {
        title: 'Наботы'
      },
      orderId: null
    }
  },
  methods: {
    onFocusedRow(row, rowId) {

      this.$router.push({path: '/cab/edu/admission/' + rowId + '/view', query: {vroute: true}},
        () => {
        }, () => {
        })

    }
  }
}
</script>
<style lang="scss" scoped>


</style>
