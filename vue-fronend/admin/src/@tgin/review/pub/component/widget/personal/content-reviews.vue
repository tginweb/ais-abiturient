<template>

  <div class="" v-if="queries.stat.result">

    вы оставили {{queries.stat.result.COUNT}} отзывов

  </div>

</template>

<script>
import CProfile from "@tgin/sale/pub/component/order/profile/inc/profile";
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  components: {
    CProfile
  },
  apollo: {
    stat: generateQueryInfo('stat', require('@tgin/review/pub/gql/query/user_stat.gql')),
  },
  data() {
    return {
      queries: {
        stat: {
          state: {
            isLoading: false
          },
          result: null
        },
      }
    }
  },
  computed: {

  }
}
</script>
<style lang="scss" scoped>


</style>
