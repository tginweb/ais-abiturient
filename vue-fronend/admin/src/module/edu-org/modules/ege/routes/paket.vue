<template>

  <component
      v-model="visible"
      :loading="fetching"
      dialogWidth="650px"
      title="Пакет ФИС"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >
    <template v-slot:default>

      <q-form ref="form" class="row q-col-gutter-lg">

        <div class="col-24">
          <div class="com s-info-section">
            <div class="__header">Запрос ФИС</div>

            <div style="max-height: 50vh;overflow:scroll;">
              <q-markup-table
                  v-if="orders.length>0"
                  class="c-nodes s-table-data"
                  flat
              >
                <thead>
                <tr>
                  <th>#</th>
                  <th>ФИО</th>
                  <th>№</th>
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

                </tr>
                </tbody>
              </q-markup-table>
            </div>

            <q-btn
                class="full-width"
                color="primary"
                label="Скачать файл запроса"
                @click="onDownload"
            />

          </div>
        </div>

        <div class="col-24">
          <div class="com s-info-section">
            <div class="__header">Ответ ФИС</div>

            <q-file
                class="q-mt-lg q-mb-lg"
                v-model="file"
                @input="onFileInput"
                outlined
                label="Файл ответа ФИС"
            />

            <q-btn
                class="full-width"
                color="primary"
                label="Загрузить и обработать ответ"
                @click="onSubmit"
            />

          </div>
        </div>

      </q-form>
    </template>
  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    orderIds: { default: () => []}
  },
  components: {},
  data() {
    return {
      entityIdState: this.entityId,
      file: null,
      fileContent: null,
      orders: []
    }
  },
  computed: {

  },
  async mounted() {
      await this.fetchOrders()
  },
  methods: {

    async fetchOrders() {
      const {data: {res}} = await this.$apollo.query({
        query: require('~module/edu-org/modules/order/gql/order/query/list_minimal.gql'),
        fetchPolicy: 'no-cache',
        variables: {
          ids: this.orderIds
        }
      })
      this.orders = res
    },

    async onSubmit() {

      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/packet_result_process.gql'),
          variables: {
            packet: this.fileContent
          },
          state: this.requestState,
        })

        console.log(res)
      } catch (e) {
        console.log(e)
      }

    },

    onFileInput() {
      let reader = new FileReader()
      reader.onload = (event) => {
        this.fileContent = event.target.result
      }
      reader.readAsText(this.file)
    },

    async onDownload() {
      const res = await this.$store.dispatch('gql/fetch', {
        query: require('../gql/query/packet_generate.gql'),
        variables: {
          ids: this.orderIds
        },
        state: this.requestState,
      })

      this.$util.base.downloadCustomContent('paket.csv', res.payload)
    },

  },
  watch: {}

}

</script>

<style lang="scss" scoped>


</style>
