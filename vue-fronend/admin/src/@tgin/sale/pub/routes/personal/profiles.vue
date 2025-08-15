<template>

  <component
      v-bind="bindRouterWrapper"
      :path="pagePathFull"
      :title="pageTitle"
      @hide="onHide"
  >

    <div class="q-px-md q-px-lg-none q-mt-md q-mt-lg-none">

      <div
          v-for="personType of personTypes"
          class="q-mb-xl"
      >

        <div class="flex q-mb-lg items-center">

          <div class="q-mr-auto s-font-md s-font-md-lg s-font-md-xl  text-weight-bold" v-if="haveMultiplePersonTypes">
            {{ !personType.IS_COMPANY ? 'Адреса физических лиц' : 'Адреса компаний' }}
          </div>

          <div>
            <q-btn
                :icon="$q.screen.gt.sm ? $icons.fasPlus:undefined"
                label="Добавить"
                dense
                color="primary"
                class="s-font-3xs s-font-xs-2xs s-font-sm-xs s-font-md-md"
                :to="{name: 'sale:profile.add', params: {personTypeId: personType.ID}}"
            />
          </div>

        </div>

        <div>
          <CProfiles
              ref="profiles"
              v-model="defaultProfileId"
              :person-type-id="personType.ID"
              :show-person-type="false"
              :show-company="true"
              :allow-select="!personType.IS_COMPANY"
              :allow-add="false"
              :add-label="!haveMultiplePersonTypes ? 'Добавить адрес' : (!personType.IS_COMPANY ? 'Добавить адрес физ. лица' : 'Добавить адрес компании')"
              :items="personType.ITEMS"
              @changed="onChanged"
          />
        </div>
      </div>

    </div>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'
import CProfiles from "../../component/order/profile/list.page";
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  mixins: [MRoute, MVRoute],
  apollo: {
    entities: generateQueryInfo('entities', require('../../gql/profile/query/list.gql')),
  },
  components: {
    CProfiles
  },
  props: {},
  data() {
    return {
      page: {
        title: 'Адреса доставки',
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

    personTypes() {
      return Object.values((this.queries.entities.result || []).reduce((map, item) => {
        if (!map[item.PERSON_TYPE_ID])
          map[item.PERSON_TYPE_ID] = {
            ...item.PERSON_TYPE,
            ITEMS: []
          }
        map[item.PERSON_TYPE_ID].ITEMS.push(item)
        return map
      }, {}))
    },

    haveMultiplePersonTypes() {
      return this.personTypes.length > 1
    },

    defaultProfileId: {
      get: function () {
        return this.$store.getters['sale_pub/userOrderProfileId']
      },
      set: async function (val) {
        this.$store.dispatch('sale_pub/userOrderProfileSetDefault', val)
      }
    },

    actions() {
      const result = [];
      return result
    },
  },
  methods: {
    onChanged() {
      this.$apollo.queries.entities.refetch()
    }
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
