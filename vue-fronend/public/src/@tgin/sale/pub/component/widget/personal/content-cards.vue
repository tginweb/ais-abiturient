<template>

  <div class="">

    <div v-if="defaultCard">
      {{ defaultCard.NAME }}
    </div>
    <div v-else>
      нет сохраненных карт
    </div>

  </div>

</template>

<script>
import CProfile from "@tgin/sale/pub/component/card/inc/profile";
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  components: {
    CProfile
  },
  apollo: {
    entities: generateQueryInfo('entities', require('../../../gql/paycard/query/list.gql')),
  },
  data() {
    return {
      queries: {
        entities: {
          vars: {},
          state: {
            isLoading: false,
            skip: false
          },
          result: null
        },
      },
    }
  },
  computed: {
    defaultCard() {
      return (this.queries.entities.result || []).find(item => item.DEFAULT)
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
