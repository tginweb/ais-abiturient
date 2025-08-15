<template>

  <component
      v-model="visible"
      :loading="fetching"
      :title="title"
      dialogWidth="1250px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >
    <template v-if="entityState" v-slot:default>

      <q-form ref="form">
        <div class="row q-mb-md">
          <q-input
              v-model="entityState.name"
              class="col-24"
              label="Наименование"
              outlined
          />
        </div>
        <div v-if="actionState === 'edit'">
          <q-btn
              class="q-mb-md"
              color="primary"
              label="Добавить ВИ"
              @click="onAddTests"
          />
          <q-markup-table class="text-left s-table">
            <thead>
            <tr>
              <th>Абитуриент</th>
              <th>Статус</th>
              <th>Предмет</th>
              <th>Способ сдачи</th>
              <th>Текущий балл ВИ</th>
              <th>Балл по ведомости</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="test of tests">
              <td>
                <div v-if="test.test.order" class="cursor-pointer">
                  <div class="text-weight-bold relative-position">
                    {{ test.test.order.fio }}
                  </div>
                  <div class="q-mt-xs text-grey-7 text-no-wrap">
                    {{ test.test.order.uid }}
                  </div>
                </div>
                <div v-else>
                  {{ test.test.orderId }}
                </div>
              </td>
              <td>
                <div
                    v-if="test.test.order.state.statusInfo"
                    :style="{
                        color: test.test.order.state.statusInfo.color
                     }"
                    class="s-badge"
                >
                  {{ test.test.order.state.statusInfo.titleAdmin }}
                </div>
              </td>
              <td>
                {{ test.test.subject.name }}
              </td>
              <td>
                {{ test.test.passingTypeName }}
              </td>
              <td>
                {{ test.test.resultBall }}
              </td>
              <td>
                <q-input
                    v-model="test.ball"
                    label="Балл по ведомости"
                    outlined
                    color="primary"
                />
              </td>
            </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div v-else class="q-py-lg q-px-lg text-center text-red">
          Для добавления ипытаний сначала сохраните ведомость.
        </div>
      </q-form>
    </template>
  </component>
</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {},
  components: {

  },
  apollo: {
    admissions: {
      query: require('~module/edu-org/modules/admission/gql/query/list.gql'),
      update: data => data.res,
    },
  },
  data() {
    return {
      entityIdState: this.entityId,
      tests: []
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Сохранить',
          callback: this.onSubmit
        }
      ]
    },
    title() {
      return 'Ведомость ' + (this.entity ? this.entity.nid : '')
    },
  },
  async created() {
    await this.fetch()
    if (this.action === 'edit')
      await this.fetchTests()
  },
  methods: {
    entityForSave(entity) {
      return {
        ...entity,
        tests: this.tests.map(item => ({
          _id: item._id,
          testId: item.testId,
          ball: parseInt(item.ball),
        }))
      }
    },
    async onSubmitCommit() {
      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/update.gql'),
          variables: {
            id: this.entityIdState || this.entityIdTemp,
            action: this.actionState,
            model: this.entityForSave(this.entityState)
          }
        })
        if (res.result.success) {
          if (this.actionState === 'create') {
            this.entityIdState = res.payload.entityId
            this.actionState = 'edit'
            await this.fetch()
          }
          this.onResolve && this.onResolve()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async onSubmit() {
      try {
        if (await this.$refs.form.validate())
          await this.onSubmitCommit()
      } catch (e) {
        console.log(e)
      }
    },
    onAddTests() {
      this.$router.push({
        name: 'edu.sheet:add-tests',
        params: {
          entityData: this.entityState,
          onResolve: this.onAddTestsDone
        }
      })
    },
    async onAddTestsDone(ids) {
      const res = await this.$store.dispatch('gql/mutation', {
        mutation: require('../gql/mutation/tests_add.gql'),
        variables: {
          sheetId: this.entityIdState,
          testIds: ids
        }
      })
      if (res.result.success) {
        await this.fetchTests()
      }
    },
    async fetch() {
      if (this.actionState !== 'create') {
        try {
          const entity = await this.$store.dispatch('gql/fetch', {
            query: require('../gql/query/single.gql'),
            variables: {
              filter: {
                _id: {eq: this.entityIdState}
              }
            },
            state: this.requestState,
          })
          this.orderIdState = entity.orderId
          this.assignEntity(entity)
        } catch (e) {
          console.log(e)
        }
      } else {
        this.assignEntity({})
      }
    },
    async fetchTests() {
      this.tests = await this.$store.dispatch('gql/fetch', {
        query: require('../gql/query/fetch_tests.gql'),
        variables: {
          sheetId: this.entityIdState
        },
        state: this.requestState,
      })
    },
  }
}

</script>

<style lang="scss" scoped>

.s-accent {

}

</style>
