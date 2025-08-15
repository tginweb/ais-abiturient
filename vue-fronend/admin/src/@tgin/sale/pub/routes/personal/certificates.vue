<template>

  <component
    v-bind="bindRouterWrapper"
    :path="pagePathFull"
    :title="pageTitle"
    @hide="onHide"
  >

    <q-list
        class="c-options border-primary-brown-gray-1 border-lg-1 border-radius-xs"
    >

        <q-item
            v-ripple
            class="q-px-none q-py-sm q-px-md-md q-py-md-md border-b-lg-1 border-primary-brown-gray-1 border-b-last-0"
            manual-focus
            tag="label"
        >

          <q-item-section>
            <q-item-label class="text-dark">
              S*****34
            </q-item-label>
            <q-item-label caption>
              <div>
                Сумма: 3000 руб.
              </div>
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label class="text-right q-gutter-x-md">

              <q-btn
                  :icon="$icons.farEye"
                  label="просмотр"
                  dense
                  flat
                  to="/personal/buyer-company"
              />

            </q-item-label>
          </q-item-section>

        </q-item>

    </q-list>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'
import CProfiles from "../../component/order/profile/list.page";

export default {
  mixins: [MRoute, MVRoute],
  components: {
    CProfiles
  },
  props: {
  },
  data() {
    return {
      page: {
        title: 'Подарочные сертификаты',
      },
    }
  },
  computed: {
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

      result.push({
        label: 'Купить сертификат',
        icon: this.$icons.fasPlus,
        color: this.vrouterIsPage ? '' : 'primary',
        callback: () => {
          this.$refs.view.onCreate()
        }
      })

      return result
    },

    modes() {
      return [
        {
          id: 'paid',
          label: 'Купленные мной',
          type: 'tab',
          actions: () => {

          }
        },
        {
          id: 'activated',
          label: 'Активированные мной',
          type: 'tab',
          actions: () => {
            return []
          }
        },
      ]
    },
  },
  methods: {
    onSaved() {

      console.log('PROFILES UPDATED')
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
