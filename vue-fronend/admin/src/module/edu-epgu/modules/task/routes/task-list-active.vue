<template>
  <q-page class="">

    <layout-cab-page-header
      title="Активные задания"
    />

    <CList
      :query="() => require('../gql/query/task_listRecordset.gql')"
      :filtersQuery="() => require('../gql/query/task_listFilters.gql')"
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
        title: 'Наборы'
      },
      orderId: null
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>


</style>
