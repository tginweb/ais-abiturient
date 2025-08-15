<template>

  <component
      v-bind="bindRouterWrapper"
      :path="pagePathFull"
      title="Способы оплаты"
      @hide="onHide"
  >

    <CCards
        ref="view"
        v-model="defaultSid"
        :items="queries.entities.result || []"
    />

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'
import CCards from "../../component/card/list.page";
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  mixins: [MRoute, MVRoute],
  apollo: {
    entities: generateQueryInfo('entities', require('../../gql/paycard/query/list.gql')),
  },
  components: {
    CCards
  },
  data() {
    return {
      page: {
        title: 'Способы оплаты',
      },
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

    defaultSid: {
      get: function () {
        const card = this.entities.find(item => !!item.DEFAULT)
        if (card)
          return card.VALUE
      },
      set: async function (val) {
        try {

          await this.$store.dispatch('gql/mutation', {
            mutation: require('@tgin/sale/pub/gql/paycard/mutation/paycard_default.gql'),
            variables: {
              sid: val
            }
          })
        } catch (e) {
          console.log(e)
        }
      }
    },

    entities() {
      return this.queries.entities.result || []
    },

    actions() {

      const result = [];

      result.push({
        label: 'Добавить способ оплаты',
        icon: this.$icons.fasPlus,
        color: this.vrouterIsPage ? '' : 'primary',
        callback: () => {
          this.$refs.view.onCreate()
        }
      })

      return result
    },
  },
  methods: {

    async onSetDefault(sid) {

      if (!sid)
        return;

    },
  }
}
</script>
<style lang="scss" scoped>

.c-orders {
  border: 1px solid #EFEEEE;

  .c-orders__order:not(:last-child) {
    border-bottom: 1px solid #EFEEEE;
  }
}

</style>
