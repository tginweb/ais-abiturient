<template>

  <component
    v-if="entity"
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    :title="'Просмотр задания ' + entityId"
    dialogWidth="900px"
    @hide="onHide"
  >

    <div class="q-mb-md q-px-sm q-py-xs bg-primary-brown-1">
      <ui-nav-toolbar
        :items="entity.actions"
        :args="toolbarArgs"
        @actionResolve="onActionResolve"
        class=""
      />
    </div>

    <div class="q-mb-md q-pa-md border-1 border-dark">
      <div class=" flex q-gutter-x-md ">
        <div>
          <div class="s-font-xs text-grey">ID:</div>
          {{entity.id}}
        </div>
        <div>
          <div class="s-font-xs text-grey">Тип:</div>
          {{entity.type}}
        </div>
        <div>
          <div class="s-font-xs text-grey">Субтип:</div>
          {{entity.subtype}}
        </div>
        <q-space/>

        <div class="">
          <div class="s-font-xs text-grey">Шаг:</div>
          {{entity.state.step}}
        </div>
        <div class="">
          <div class="s-font-xs text-grey">Статус:</div>
          {{entity.state.status}}
        </div>
      </div>
    </div>


    <q-form ref="form">

      <q-tabs
        v-model="tab"
        active-color="white"
        active-bg-color="secondary"
        align="justify"
        class=" text-primary"
        dense
        indicator-color="white"
        narrow-indicator
      >
        <q-tab label="Общее" name="common"/>
        <q-tab label="Входные" name="scope.source"/>
        <q-tab label="Цели" name="scope.target"/>
        <q-tab label="Payload" name="payload"/>
        <q-tab label="Токен" name="token"/>
        <q-tab label="Дочерние" name="children"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>

        <q-tab-panel name="common" class="q-px-none">

          <ui-data-tree-view
            v-if="entity"
            :data="entityViewTree"
            :expanded="['Общее']"
          />

        </q-tab-panel>

        <q-tab-panel name="scope.source" class="q-px-none">

          <q-input
            :value="entity.scope.source.entityIds.join('\n')"
            label="ID сущностей"
            outlined
            readonly
            type="textarea"
          />

        </q-tab-panel>

        <q-tab-panel name="scope.target" class="q-px-none">

          <q-markup-table class="data-table text-left">
            <thead>
            <tr>
              <th class="">id</th>
              <th class="">Title</th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="item of entity.scope.target.entities"
              :key="item.id"
            >
              <td class="">{{ item.id }}</td>
              <td class="">{{ item.title }}</td>
            </tr>
            </tbody>
          </q-markup-table>

        </q-tab-panel>

        <q-tab-panel name="payload" class="q-px-none">

          <div class="q-gutter-y-md">

            <q-input
              v-model="entity.payload"
              input-style="height: 35vh; white-space: nowrap;"
              label="Payload"
              outlined
              type="textarea"
            />

          </div>

          <q-btn @click="onSubmit" label="Сохранить"/>

        </q-tab-panel>

        <q-tab-panel name="token" class="q-px-none">

          <div class="q-gutter-y-md">

            <q-input
              :value="JSON.stringify(entity.header, null, 2)"
              input-style="height: 100px"
              label="Header"
              outlined
              type="textarea"
            />

            <q-input
              v-model="entity.token"
              input-style="height: 35vh"
              label="Токен"
              outlined
              type="textarea"
            />

            <q-input
              v-model="entity.infoToken"
              input-style="height: 35vh"
              label="Инфо токен"
              outlined
              type="textarea"
            />

          </div>

          <q-btn @click="onSubmit" label="Сохранить"/>

        </q-tab-panel>

        <q-tab-panel name="children" class="q-px-none">

          <CDataList
            :columns="children.columns"
            :columnsVisible="children.columnsVisible"
            :filtersDefaults="children.filterDefaults"
            :query="() => require('../gql/query/task_listRecordset.gql')"
            selectionType="multiple"
            storePrefix="edu_epgu_task/entity"
          />


        </q-tab-panel>

      </q-tab-panels>

    </q-form>

  </component>

</template>

<script>

import MVroute from '@common/router/mixin/vroute'
import CDataList from '~module/cab/component/ui/data-list'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {}
  },
  components: {
    CDataList
  },
  data() {
    return {
      tab: 'scope.source',
      tabEntities: 'source',

      children: {
        filterDefaults: {
          parent: {eq: this.entityId}
        },
        columnsVisible: [
          'id',
          'type',
          'subtype',
          'state.step',
          'state.status',
          'idJwt',
          'ops'
        ],
        columns: [
          {
            name: 'id',
            label: 'ID',
            sortable: true,
            opener: true,
            field: (row) => row.id
          },
          {
            name: 'type',
            label: 'Тип',
            sortable: true,
            opener: true,
            field: (row) => row.type
          },
          {
            name: 'subtype',
            label: 'Подтип',
            sortable: true,
            opener: true,
            field: (row) => row.subtype
          },
          {
            name: 'state.step',
            label: 'Шаг',
            sortable: true,
            opener: true,
            field: (row) => row.state.step
          },
          {
            name: 'state.status',
            label: 'Статус',
            sortable: true,
            opener: true,
            field: (row) => row.state.status
          },
          {
            name: 'idJwt',
            label: 'idJwt',
            sortable: true,
            opener: true,
            field: 'idJwt'
          },
          {
            name: 'ops',
            label: 'Действия',
            sortable: true,
            actions: true
          },
        ],
      }
    }
  },
  computed: {
    toolbarArgs() {
      return {
        id: parseInt(this.entityId)
      }
    },

    actions() {
      return [

      ]
    },

    entityViewTree() {

      const res = []

      const entity = this.entity

      res.push({
        label: 'Общее',
        expanded: true,
        children: [
          {label: '_id', value: entity._id},
          {label: 'ID', value: entity.id},
          {label: 'Тип', value: entity.type},
          {label: 'Подтип', value: entity.subtype},
        ]
      })

      return res
    }
  },
  created() {
    this.fetch()
  },
  methods: {

    async onActionResolve() {
      await this.fetch()
    },

    async onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          await this.mutationMethod(async () => {

            try {

              let {data} = await this.$apollo.mutate({
                mutation: require('../gql/mutation/task_edit.gql'),
                variables: {
                  model: this.entity,
                }
              })

              if (this.onResolve)
                this.onResolve()

            } catch (e) {

            }

          })

          console.log('CVV')
        }

      }).catch((e) => {

      })

    },
    async fetch() {
      await this.fetchingMethod(async () => {
        if (this.entityId)
          this.entity = this.entityData || await this.$store.dispatch('edu_epgu_task/entityFetchDetail', parseInt(this.entityId))
      })
    },

  },

}

</script>

<style lang="scss" scoped>


</style>
