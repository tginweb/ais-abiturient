<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="!!queriesLoading"
      :loaded="!queriesLoading"
      :error="!!queriesErrors"
      title="Смена фактультета для заявлений"
      @hide="onHide"
      dialog-width="500px"
  >
    <template v-slot:header-bottom>

      <q-form ref="form" class="q-px-md q-pt-md">

        <q-select
            v-model="instituteId"
            :options="$store.getters['edu_institute/optionsActive']"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Новый факультет"
            map-options
            option-label="name"
            option-value="_id"
            outlined
        />

        <div class="s-font-lg q-mt-lg q-mb-md">Заявления, у которых сменится факультет:</div>

      </q-form>

    </template>

    <template v-slot:default>

      <q-markup-table
          v-if="orders.length>0"
          class="c-nodes s-table-data"
          flat
      >
        <thead>
        <tr>
          <th>#</th>
          <th>ФИО</th>
          <th>№ заявления</th>
          <th>Текущий факультет</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in orders"
            class="__item"
        >
          <td class="">
            {{ index + 1 }}
          </td>

          <td class="">
            {{ item.fio }}
          </td>

          <td class="">
            {{ item.nid }}
          </td>

          <td class="">
            <div v-if="item.institute">
              {{ item.institute.name }}
            </div>
          </td>

        </tr>
        </tbody>
      </q-markup-table>

    </template>
  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import generateQuery from "@tgin/main/graphql/lib/generate-query";

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    ids: {}
  },
  apollo: {
    orders: generateQuery('orders', {
      query: require('../gql/order/query/list.gql'),
      variables() {
        return {
          ids: this.ids
        }
      }
    }),
  },
  components: {},
  data() {
    return {
      deleteInstitute: false,
      instituteId: null,
      nodes: null,
      queriesLoading: 0,
      queriesErrors: 0,
      orders: null
    }
  },
  computed: {

    actions() {
      if (this.queriesLoading)
        return []

      return [
        {
          label: 'Сменить',
          callback: this.onSumbit,
          // disable: !this.nodes.length
        }
      ]
    },

    instituteOptions() {
      return this.institutes.map((item) => ({
        id: item._id,
        name: item.name
      }))
    }
  },
  async created() {

    //await this.fetch()
  },
  methods: {

    async fetch() {
      const {data: {res}} = await this.$apollo.query({
        query: require('../gql/order/query/list.gql'),
        fetchPolicy: 'no-cache',
        variables: {
          ids: this.ids
        }
      })
      this.nodes = res
    },

    onSumbit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            await this.$store.dispatch('gql/mutation', {
              dispatch: 'edu_order/apiMutate',
              payload: {
                mutation: 'changeInstitute',
                ids: this.ids,
                instituteId: this.instituteId
              }
            })

            this.onResolve && this.onResolve()
            this.visible = false

          } catch (e) {

            console.log(e)
          }

        }

      }).catch((e) => {

      })
    }

  },
  watch: {}

}

</script>

<style lang="scss" scoped>


</style>
